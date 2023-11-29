import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useRef, useMemo } from 'react';

import { useCaptcha } from '@app/hooks/useCaptcha';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/ContactPage/contactUs.gql';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useContactPage = ({ cmsBlockIdentifiers = [], operations }) => {
    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();
    const { contactMutation, getStoreConfigQuery, getContactPageCmsBlocksQuery } = mergeOperations(
        DEFAULT_OPERATIONS,
        operations
    );

    const formApiRef = useRef(null);
    const [, { addToast }] = useToasts();
    const [submitForm, { data, error: contactError, loading: submitLoading }] = useMutation(contactMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeaders
        }
    });

    const { data: storeConfigData, loading: configLoading } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const { data: cmsBlocksData, loading: cmsBlocksLoading } = useQuery(getContactPageCmsBlocksQuery, {
        variables: {
            cmsBlockIdentifiers
        },
        fetchPolicy: 'cache-and-network'
    });

    const isEnabled = useMemo(() => {
        return !!storeConfigData?.storeConfig?.contact_enabled;
    }, [storeConfigData]);

    const cmsBlocks = useMemo(() => {
        return cmsBlocksData?.cmsBlocks?.items || [];
    }, [cmsBlocksData]);

    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const handleSubmit = useCallback(
        async ({ name, email, comment, telephone }) => {
            try {
                await executeCaptchaValidation('contact_form');
                await submitForm({
                    variables: {
                        name,
                        email,
                        comment,
                        telephone
                    }
                });
                if (formApiRef.current) {
                    formApiRef.current.reset();
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                if (error) {
                    addToast({
                        type: 'error',
                        message: error.message
                    });
                }
            }
        },
        [addToast, executeCaptchaValidation, submitForm]
    );
    const errors = useMemo(() => new Map([['contactMutation', contactError]]), [contactError]);

    return {
        isEnabled,
        cmsBlocks,
        errors,
        handleSubmit,
        isBusy: submitLoading,
        isLoading: configLoading && cmsBlocksLoading,
        setFormApi,
        response: data && data.contactUs
    };
};
