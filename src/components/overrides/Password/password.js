import { string, bool, shape, func } from 'prop-types';
import React from 'react';
import { Eye, EyeOff } from 'react-feather';

import Field from '@app/components/overrides/Field';
import TextInput from '@app/components/overrides/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './password.module.css';
import { usePassword } from './usePassword';

const Password = ({
    classes: propClasses,
    label,
    fieldName,
    isToggleButtonHidden,
    autoComplete,
    validate,
    ...otherProps
}) => {
    const talonProps = usePassword();
    const { handleBlur, togglePasswordVisibility, visible } = talonProps;
    const classes = useStyle(defaultClasses, propClasses);

    const passwordButton = (
        <Button className={classes.passwordButton} onClick={e => togglePasswordVisibility(e)} type="button">
            {visible ? <Eye className={classes.icon} /> : <EyeOff className={classes.icon} />}
        </Button>
    );

    const fieldType = visible ? 'text' : 'password';

    return (
        <Field classes={{ root: classes.root }}>
            <TextInput
                after={!isToggleButtonHidden && passwordButton}
                autoComplete={autoComplete}
                label={label}
                field={fieldName}
                type={fieldType}
                validate={validate}
                onBlur={handleBlur}
                {...otherProps}
            />
        </Field>
    );
};

Password.propTypes = {
    autoComplete: string,
    classes: shape({
        root: string
    }),
    label: string,
    fieldName: string,
    isToggleButtonHidden: bool,
    validate: func
};

Password.defaultProps = {
    isToggleButtonHidden: true,
    validate: isRequired
};

export default Password;
