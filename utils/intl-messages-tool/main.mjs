/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable func-style */
import * as fs from 'fs';
import * as Path from 'path';
import { exit } from 'process';

import * as parser from '@babel/parser';
import * as _commandLineArgs from 'command-line-args';
const commandLineArgs = _commandLineArgs.default;

import csvParser from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

import util from 'util';
import childProcess from 'child_process';

import { CmdValidateUseCases } from './CmdValidateUseCases.mjs';

export let args = null;

try {
    args = commandLineArgs([
        { name: 'args', type: String, multiple: true, defaultOption: true },
        { name: 'quiet', alias: 'q', type: Boolean },
        { name: 'skip', alias: 's', type: String }
    ]);
} catch (e) {
    log('' + e);
    exit(1);
}

if (args.args == null) {
    showHelp();
    exit(0);
}

const command = args.args[0];
const commandArgs = args.args.slice(1);

switch (command) {
    case ('export', 'e'):
        await new Promise(cmdExport);
        break;
    case ('import', 'i'):
        await new Promise(cmdImport);
        break;
    case ('validate', 'v'):
        new CmdValidateUseCases(commandArgs);
        break;
    case ('saveAst', 's'):
        cmdSaveAst();
        break;
    default:
        log('Unknown command: ' + command);
        exit(1);
}

async function cmdExport(resolve) {
    if (commandArgs.length != 1) {
        showHelp();
        return;
    }

    const { dedupedTexts } = getTexts();

    const outFile = commandArgs[0];

    const csvWriter = createObjectCsvWriter({
        path: outFile,
        alwaysQuote: true,
        header: [{ id: 'key', title: 'key' }, { id: 'message', title: 'message' }]
    });

    const skipTexts = args.skip != null ? JSON.parse(fs.readFileSync(args.skip)) : null;

    const csvRecords = [];
    for (const key in dedupedTexts) {
        if (skipTexts != null && skipTexts[key] != null) continue;

        csvRecords.push({
            key: key,
            message: dedupedTexts[key]
        });
    }

    await csvWriter.writeRecords(csvRecords);

    log('Messages exported to ' + outFile);

    resolve();
}

async function cmdImport(resolve) {
    if (commandArgs.length < 2) {
        showHelp();
        return;
    }

    const inFile = commandArgs[0];
    const outFile = commandArgs[1];
    const onlyAdd = commandArgs[2] && commandArgs[2] === 'only-add';

    const { dedupedTexts, textsKeysDuplicatesGroups } = getTexts();

    const inTexts = [];

    await new Promise(function(resolve, reject) {
        fs.createReadStream(inFile)
            .pipe(csvParser())
            .on('data', row => {
                if (row.key != null && row.message != null) {
                    inTexts[row.key] = row.message;
                }
            })
            .on('end', () => {
                resolve();
            });
    });

    // Get all keys with duplicates
    const duplicatesKeysMap = {};
    for (const group of textsKeysDuplicatesGroups) {
        for (const key of group) {
            duplicatesKeysMap[key] = group;
        }
    }

    // Get all texts

    let outTexts;
    if (fs.existsSync(outFile)) {
        outTexts = JSON.parse(fs.readFileSync(outFile));
    } else {
        outTexts = {};
    }

    for (const key in inTexts) {
        if (dedupedTexts[key] == null) continue;

        // Get duplicates if there are ones
        if (duplicatesKeysMap[key] != null && !onlyAdd) {
            for (const key2 of duplicatesKeysMap[key]) {
                outTexts[key2] = inTexts[key];
            }
        } else if (onlyAdd && !!outTexts[key]) {
            continue;
        } else {
            outTexts[key] = inTexts[key];
        }
    }

    fs.writeFileSync(outFile, JSON.stringify(outTexts, null, '  '));
    log('Messages imported into ' + outFile + ' for use in i18n directory.');

    resolve();
}

function getTexts() {
    // Merge messages from both sources

    // App messages
    const yarnBin = ('' + childProcess.execSync('yarn bin')).trim();
    const content = childProcess.execSync(
        yarnBin + "/formatjs extract 'src/**/*.js' --id-interpolation-pattern '[sha512:contenthash:base64:6]'",
        { maxBuffer: 16 * 1024 * 1024 }
    );

    // Venia-ui messages
    const texts = JSON.parse(fs.readFileSync('node_modules/@magento/venia-ui/i18n/en_US.json'));
    const appTexts = JSON.parse(content);

    // Merge appTexts into common texts
    for (const key in appTexts) {
        if (appTexts[key].defaultMessage != null) {
            texts[key] = appTexts[key].defaultMessage;
        }
    }

    // Deduplication

    // Find unique texts only, and list all used keys under single unique text
    const textsMap = {};
    for (const key in texts) {
        const text = texts[key];

        if (textsMap[text] == null) textsMap[text] = [];

        textsMap[text].push(key);
    }

    const dedupedTexts = {};
    const textsKeysDuplicatesGroups = [];

    // TextsKeysDuplicatesGroups - all keys which share single unique text, and are used for more than 1 key
    // DedupedTexts - unique texts with first used key

    for (const text in textsMap) {
        if (textsMap[text].length > 1) {
            textsKeysDuplicatesGroups.push(textsMap[text]);
        }

        dedupedTexts[textsMap[text][0]] = text;
    }

    return {
        textsKeysDuplicatesGroups: textsKeysDuplicatesGroups,
        dedupedTexts: dedupedTexts
    };
}

function cmdSaveAst() {
    if (commandArgs.length != 2) {
        showHelp();
        return;
    }

    const { ast } = parseFile(commandArgs[0]);

    fs.writeFileSync(commandArgs[1], JSON.stringify(ast));
}

function showHelp() {
    const arg1 = Path.relative('.', process.argv[1]);

    log(`  Syntax: node ${arg1} COMMAND [args]
    COMMAND:
    (export | e) OUT-FILE
    - export messages to OUT-FILE csv. Merges venia-ui default messages and ones extracted from .js files of src directory.

    (import | i) IN-FILE OUT-FILE
    - import messages from IN-FILE csv and makes OUT-FILE json for use in applications i18n directory.

    (validate | v) SOURCE [SOURCE...]
    - validates use cases for intl messages.

    One type of case is when formatMessage() and <FormattedMessage/> are used with runtime variables, in result formatjs extract can't find defined texts. Solution is to put these texts in i18n/en_US.json file.
    2. case: { defaultMessage: <variable> } without formatMessage() call
    `);
}

export function walkDir(dir, cb) {
    fs.readdirSync(dir).forEach(file => {
        const path = dir + '/' + file;
        const stat = fs.lstatSync(path);

        cb(path, file, stat);

        if (stat.isDirectory()) {
            walkDir(path, cb);
        }
    });
}

export function log() {
    console.log(...arguments);
}

export function inspect() {
    for (const arg of arguments) {
        log(util.inspect(arg));
    }
}

export function parseFile(filepath) {
    const code = '' + fs.readFileSync(filepath);

    const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx']
    });

    return {
        code: code,
        ast: ast
    };
}
