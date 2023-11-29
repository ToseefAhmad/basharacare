import { shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import Field from '@app/components/overrides/Field';
import TextInput from '@app/components/overrides/TextInput';
import { usePostcode } from '@magento/peregrine/lib/talons/Postcode/usePostcode';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './postcode.module.css';

const Postcode = props => {
    const { classes: propClasses, fieldInput, label, isRequired } = props;

    const classes = useStyle(defaultClasses, propClasses);

    const { formatMessage } = useIntl();

    const fieldLabel =
        label ||
        formatMessage({
            id: 'postcode.label',
            defaultMessage: 'ZIP / Postal Code'
        });

    usePostcode({ fieldInput });

    return (
        <Field id={classes.root} label={fieldLabel} classes={{ root: classes.root }}>
            <TextInput
                validate={props.validate}
                classes={{ input: classes.textInput }}
                field={fieldInput}
                id={classes.root}
                isRequired={isRequired}
            />
        </Field>
    );
};

export default Postcode;

Postcode.defaultProps = {
    fieldInput: 'postcode'
};

Postcode.propTypes = {
    classes: shape({
        root: string
    }),
    fieldInput: string,
    label: string
};
