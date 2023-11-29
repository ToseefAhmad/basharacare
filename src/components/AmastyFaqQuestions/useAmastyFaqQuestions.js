import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { CREATE_FAQ_QUESTION, GET_FAQ_QUESTIONS } from '@app/components/AmastyFaqQuestions/amastyFaqQuestions.gql';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';

const GUEST_NAME = 'Guest';

export const useAmastyFaqQuestions = ({ productId, productUrlKey }) => {
    const formApiRef = useRef(null);
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const [isOpen, setIsOpen] = useState(false);
    const [isNotification, setIsNotification] = useState(false);
    const [{ isSignedIn, currentUser }] = useUserContext();
    const userFullName = isSignedIn ? `${currentUser?.firstname} ${currentUser?.lastname}` : GUEST_NAME;

    const handleContentToggle = useCallback(() => {
        setIsOpen(isOpen => !isOpen);
    }, []);

    const handleChange = useCallback(() => {
        setIsNotification(isNotification => !isNotification);
    }, []);

    const [submitForm, { data: formSubmitResponse, loading: submitLoading }] = useMutation(CREATE_FAQ_QUESTION, {
        onCompleted: () => {
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'askQuestionSubmit.success',
                    defaultMessage: `Question successfully submitted!`
                })
            });
        },
        onError: () => {
            addToast({
                type: 'info',
                message: formSubmitResponse?.placeAmFaqQuestion?.message
            });
        }
    });

    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const { data: productFaqQuestions, loading: isLoadingFaqQuestions } = useQuery(GET_FAQ_QUESTIONS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            url_key: productUrlKey
        }
    });

    const faqQuestionsData = productFaqQuestions?.products?.items[0]?.amfaq_questions;

    const handleFormSubmit = useCallback(
        async ({ title, email, name }) => {
            await submitForm({
                variables: {
                    title,
                    name: name ? name : userFullName,
                    product_id: productId,
                    email: isNotification ? email : ''
                }
            });
            if (formApiRef.current) {
                formApiRef.current.reset();
            }
        },
        [submitForm, userFullName, productId, isNotification]
    );

    return {
        handleFormSubmit,
        submitLoading,
        formSubmitResponse,
        setFormApi,
        handleContentToggle,
        isOpen,
        faqQuestionsData,
        isLoadingFaqQuestions,
        handleChange
    };
};
