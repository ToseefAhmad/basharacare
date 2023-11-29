import { walkDir, parseFile, log, inspect, args } from './main.mjs';

import * as fs from 'fs';
import * as Path from 'path';

import _traverse from '@babel/traverse';
const traverse = _traverse.default;

import { exit } from 'process';

export class CmdValidateUseCases {
    messages = {};
    detectCasesNumErrors = 0;

    constructor(commandArgs) {
        const self = this;

        function checkFile(path) {
            const pathA = Path.parse(path);
            if (pathA.ext == '.js') {
                const result = self.detectWrongUseCasesForFile(path);

                if (result.errors.length > 0) {
                    log(path);
                    log('  ' + result.errors.join('\n  '));
                    log('---------------------\n');

                    self.detectCasesNumErrors++;
                }
            }
        }

        for (const source of commandArgs) {
            if (fs.lstatSync(source).isDirectory()) {
                walkDir(source, (path, file, stat) => {
                    if (stat.isFile()) {
                        checkFile(path);
                    }
                });
            } else {
                checkFile(source);
            }
        }

        if (self.detectCasesNumErrors > 0) {
            exit(1);
        }

        if (!args.quiet) {
            log('All cases of messages usage are valid.');
        }
    }

    detectWrongUseCasesForFile(filepath) {
        const isExportedComment = 'intl-messages-tool is-exported';
        const self = this;
        const { ast } = parseFile(filepath);

        const errors = [];

        function logError() {
            // Log(...arguments)

            for (const arg of arguments) {
                errors.push(arg);
            }
        }

        function objectExpressionGetProps(objectExpression) {
            const props = {};
            for (const p of objectExpression.properties) {
                if (p.key != null) {
                    props[p.key.name] = p;
                }
            }

            return props;
        }

        traverse(ast, {
            enter(path) {
                if (path.isCallExpression() && path.node.callee.name == 'formatMessage') {
                    if (path.node.arguments[0].type != 'ObjectExpression') {
                        logError("formatMessage arguments[0].type != 'ObjectExpression'");
                        logError('  line ' + path.node.arguments[0].loc.start.line + '\n');
                        return;
                    }

                    const props = objectExpressionGetProps(path.node.arguments[0]);

                    if (props.id == null || props.defaultMessage == null) {
                        logError('formatMessage props.id == null || props.defaultMessage == null');
                        return;
                    }

                    if (props.id.value.type != 'StringLiteral') {
                        logError("formatMessage props.id.value.type != 'StringLiteral'");
                        logError('  ', props.id.value.type);
                        logError('  line ' + props.id.value.loc.start.line + '\n');
                        return;
                    }

                    const id = props.id.value.value;

                    if (props.defaultMessage.value.type == 'StringLiteral') {
                        const defaultMessage = props.defaultMessage.value.value;

                        self.messages[id] = defaultMessage;
                    } else if (props.defaultMessage.value.type == 'TemplateLiteral') {
                        if (props.defaultMessage.value.expressions.length != 0) {
                            logError('props.defaultMessage.value.expressions.length != 0');
                            return;
                        }

                        if (props.defaultMessage.value.quasis.length != 1) {
                            logError('props.defaultMessage.value.quasis.length != 1');
                            return;
                        }

                        if (props.defaultMessage.value.quasis[0].type != 'TemplateElement') {
                            logError("props.defaultMessage.value.quasis[0].type != 'TemplateElement'");
                            return;
                        }

                        self.messages[id] = props.defaultMessage.value.quasis[0].value.cooked;
                    } else {
                        const leadingComments = path.node.arguments[0].properties[0].leadingComments;
                        if (
                            leadingComments == null ||
                            leadingComments[0].value.trim().toLowerCase() != isExportedComment
                        ) {
                            logError(
                                "formatMessage props.defaultMessage.value.type != 'StringLiteral', 'TemplateLiteral', 'Identifier'"
                            );
                            logError('  ', props.defaultMessage.value.type);
                            logError('  line ' + props.defaultMessage.value.loc.start.line + '\n');
                            return;
                        }
                    }
                } else if (
                    path.isJSXOpeningElement() &&
                    path.node.name.type == 'JSXIdentifier' &&
                    path.node.name.name == 'FormattedMessage'
                ) {
                    const attribs = {};

                    for (const a of path.node.attributes) {
                        if (a.name.name != 'id' && a.name.name != 'defaultMessage') continue;

                        if (
                            a.type != 'JSXAttribute' ||
                            (a.value.type != 'StringLiteral' && a.value.type != 'JSXExpressionContainer')
                        ) {
                            logError(
                                "a.type != 'JSXAttribute' || (a.value.type != 'StringLiteral' && a.value.type != 'JSXExpressionContainer')"
                            );
                            logError('  ', a.type, a.value.type, 'line ' + a.value.loc.start.line + '\n');
                            continue;
                        }

                        attribs[a.name.name] = true;
                    }

                    if (attribs.id == null || attribs.defaultMessage == null) {
                        logError('attribs.id == null || attribs.defaultMessage == null');
                        logError('  line ' + path.node.loc.start.line + '\n');
                        return;
                    }

                    self.messages[attribs.id] = attribs.defaultMessage;
                } else if (path.isObjectExpression()) {
                    const props = objectExpressionGetProps(path.node);
                    if (
                        props.defaultMessage != null &&
                        (path.parent == null ||
                            path.parent.type != 'CallExpression' ||
                            path.parent.callee.name != 'formatMessage')
                    ) {
                        const leadingComments = path.node.properties[0].leadingComments;
                        if (
                            leadingComments == null ||
                            leadingComments[0].value.trim().toLowerCase() != isExportedComment
                        ) {
                            logError(
                                'ObjectExpression.defaultMessage without formatMessage() call: possible message declaration without added record in i18n/en_US.json. Add message there and mark this place with comment: ' +
                                    isExportedComment
                            );
                            logError('  line ' + props.defaultMessage.value.loc.start.line + '\n');
                            return;
                        }
                    }
                }
            }
        });

        return {
            errors: errors
        };
    }
}
