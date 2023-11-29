import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useRef } from 'react';
import { useIntl } from 'react-intl';

import { CREATE_PRODUCT_REVIEW, GET_REVIEWS_RATING_METADATA } from '../ratingsAndReviews.gql';

import { useCaptcha } from '@app/hooks/useCaptcha';
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';

export const useReviewForm = ({ sku }) => {
    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();

    const { data: reviewsRatingMetadata } = useQuery(GET_REVIEWS_RATING_METADATA, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        retry: false
    });

    const formApiRef = useRef(null);
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const [submitForm, { data: formSubmitResponse, loading: submitLoading }] = useMutation(CREATE_PRODUCT_REVIEW, {
        context: {
            headers: captchaHeaders
        },
        onError: error => {
            if (error.message === 'ReCaptcha validation failed, please try again') {
                addToast({
                    type: 'error',
                    message: formatMessage({
                        id: 'submitForm.reCaptchaError',
                        defaultMessage: `ReCaptcha validation failed, please try again`
                    })
                });
            } else {
                addToast({
                    type: 'error',
                    message: formatMessage({
                        id: 'submitForm.unknownError',
                        defaultMessage: `Failed to submit form!`
                    })
                });
            }
        },
        onCompleted: () => {
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'reviewSubmit.success',
                    defaultMessage: `Form successfully submitted!`
                })
            });
        }
    });

    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const handleSubmit = useCallback(
        async ({ nickname, summary, text, rating }) => {
            await executeCaptchaValidation('product_review');
            const ratingValue = reviewsRatingMetadata.productReviewRatingsMetadata.items[0].values.find(
                item => item.value == rating
            );

            await submitForm({
                variables: {
                    sku,
                    nickname,
                    summary,
                    text,
                    rating_id: 'Mw==',
                    rating_value_id: ratingValue.value_id
                }
            });
            if (formApiRef.current) {
                formApiRef.current.reset();
            }
        },
        [sku, executeCaptchaValidation, reviewsRatingMetadata, submitForm]
    );

    return {
        handleSubmit,
        submitLoading,
        formSubmitResponse,
        setFormApi
    };
};
