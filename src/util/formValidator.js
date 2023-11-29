const SUCCESS = undefined;

// Checks an email to be correct.
export const isEmail = value => {
    const FAILURE = {
        // Intl-messages-tool is-exported
        id: 'validation.isEmail',
        defaultMessage: 'Please enter a valid email address (Ex: johndoe@domain.com).'
    };

    const regExpForEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regExpForEmail.test(value)) {
        return FAILURE;
    }

    return SUCCESS;
};

export const validatePhoneNumber = value => {
    // First symbol should be "+" or any number, should contain at least 5 numbers ("+" at the beginning included)
    const pattern = /^[\u0660-\u0669\u06F0-\u06F9\d\-+]+$/;

    if (!pattern.test(value)) {
        const message = {
            // Intl-messages-tool is-exported
            id: 'validation.invalidPhoneNumber',
            defaultMessage: 'Invalid phone number.'
        };

        return message;
    }

    return SUCCESS;
};

export const validCardNumber = number => {
    const regex = new RegExp('^\\d{13,19}$');

    const message = {
        id: 'validation.invaliCardNumber',
        defaultMessage: 'Invalid Card Number.'
    };

    if (!regex.test(number)) {
        return message;
    }

    return SUCCESS;
};
