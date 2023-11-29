import { useMutation } from '@apollo/client';
import { useCallback, useRef, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useCaptcha } from '@app/hooks/useCaptcha';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/Newsletter/newsletter.gql';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useNewsletter = () => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();
    const { subscribeMutation } = mergeOperations(DEFAULT_OPERATIONS);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const [subscribeNewsLetter, { error: newsLetterError, data }] = useMutation(subscribeMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeaders
        }
    });

    const handleSubmit = useCallback(
        async ({ email }) => {
            try {
                await executeCaptchaValidation('subscribe_newsletter');
                await subscribeNewsLetter({
                    variables: { email }
                });
                if (formApiRef.current) {
                    formApiRef.current.reset();
                }
                addToast({
                    type: 'success',
                    message: formatMessage({
                        id: 'newsletter.subscriptionAdded',
                        defaultMessage: 'Thank you for your subscription.'
                    })
                });
            } catch (error) {
                addToast({
                    type: 'error',
                    message: error.message
                });
                return;
            }
        },
        [addToast, executeCaptchaValidation, formatMessage, subscribeNewsLetter]
    );

    const errors = useMemo(() => new Map([['subscribeMutation', newsLetterError]]), [newsLetterError]);

    return {
        errors,
        handleSubmit,
        data,
        setFormApi
    };
};
