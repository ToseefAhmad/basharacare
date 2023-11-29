import classnames from 'classnames';
import { TextArea as InformedTextArea } from 'informed';
import { number, node, oneOf, oneOfType, shape, string } from 'prop-types';
import React, { Fragment } from 'react';

import { Resize } from '@app/components/Icons';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './textArea.module.css';

const TextArea = ({ classes: propClasses, field, message, label, ...rest }) => {
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const isRequiredField = (!!rest.validate && rest.validate === isRequired) || rest.isRequired;
    const inputClass = fieldState.error ? classes.input_error : classes.input;

    return (
        <Fragment>
            <div className={classes.container}>
                <InformedTextArea {...rest} className={inputClass} field={field} placeholder={label} />
                <span
                    className={classnames(classes.label, {
                        [classes.hidden]: !!fieldState.value
                    })}
                >
                    {label}
                </span>
                <span
                    className={classnames(classes.isRequired, {
                        [classes.hidden]: !isRequiredField
                    })}
                />
                <Resize className={classes.resize} />
            </div>
            <Message
                fieldState={fieldState}
                classes={{
                    root_error: classnames(classes.errorMsg, {
                        [classes.hidden]: !!fieldState.value
                    })
                }}
            >
                {message}
            </Message>
        </Fragment>
    );
};

export default TextArea;

TextArea.defaultProps = {
    cols: 40,
    rows: 4,
    wrap: 'hard'
};

TextArea.propTypes = {
    classes: shape({
        input: string
    }),
    cols: oneOfType([number, string]),
    field: string.isRequired,
    message: node,
    rows: oneOfType([number, string]),
    wrap: oneOf(['hard', 'soft'])
};
