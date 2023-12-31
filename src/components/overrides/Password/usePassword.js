import { useCallback, useState } from 'react';

/**
 * Returns props necessary to render a Password component.
 *
 * @returns {PasswordProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { usePassword } from '@magento/peregrine/lib/talons/Password/usePassword.js';
 */
export const usePassword = () => {
    const [visible, setVisbility] = useState(false);

    const togglePasswordVisibility = useCallback(
        e => {
            e.stopPropagation();
            setVisbility(!visible);
        },
        [visible]
    );

    const handleBlur = useCallback(() => {
        setVisbility(false);
    }, []);

    return {
        handleBlur,
        togglePasswordVisibility,
        visible
    };
};

/** JSDocs type definitions */

/**
 * Object type returned by the {@link usePassword} talon.
 * It provides props data to use when rendering the password component.
 *
 * @typedef {Object} PasswordProps
 *
 * @property {Function} handleBlur Callback to invoke when field is blurred
 * @property {Function} togglePasswordVisibility Callback function to toggle password visibility
 * @property {Boolean} visible If true password should be visible. Hidden if false.
 */
