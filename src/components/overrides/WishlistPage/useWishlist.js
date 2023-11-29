import { useMutation } from '@apollo/client';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { useToasts } from '@magento/peregrine';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './wishlist.gql';

/**
 * @param props
 * @returns {{handleSubmit: ((function({emails: *, coupon_code: *, complementary: *, message: *, pro_tips: *}): Promise<void>)|*), handleAddAllProduct: ((function(): Promise<void>)|*), setFormApi: (function(*): any), errors: Map<string, ApolloError>, isSubmitting: boolean}}
 */
export const useWishlist = (props = {}) => {
    const { id, sharing_code: sharingCode } = props;
    const operations = mergeOperations(defaultOperations, props.operations);
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const [{ cartId }] = useCartContext();

    const formApiRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { push } = useHistory();

    const [addAllProductToCart, { loading: isAddingItemsToCart }] = useMutation(operations.addAllProductToCart, {
        fetchPolicy: 'no-cache'
    });

    const [submitForm, { client, error: contactError }] = useMutation(operations.shareWishListMutation, {
        fetchPolicy: 'no-cache'
    });

    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const [editorMorningState, setEditorMorningState] = useState(() => EditorState.createEmpty());
    const [editorMorningStateAr, setEditorMorningStateAr] = useState(() => EditorState.createEmpty());

    const [editorNightState, setEditorNightState] = useState(() => EditorState.createEmpty());
    const [editorNightStateAr, setEditorNightStateAr] = useState(() => EditorState.createEmpty());

    const handleAddAllProduct = useCallback(async () => {
        await addAllProductToCart({
            variables: {
                sharingCode,
                cartId
            }
        });
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'wishlist.addedAllSuccess',
                defaultMessage: 'All the items are successfully added to cart'
            })
        });
        push('/cart');
    }, [addAllProductToCart, addToast, cartId, formatMessage, push, sharingCode]);

    const handleSubmit = useCallback(
        async ({ emails, coupon_code, complementary, pro_tips, message }) => {
            setIsSubmitting(true);

            // Remove all products from appolo cache, will be generated again.
            client.cache.evict({ fieldName: 'customerWishlistProducts' });
            client.cache.gc();

            try {
                await submitForm({
                    variables: {
                        id,
                        emails,
                        coupon_code,
                        complementary,
                        message,
                        pro_tips,
                        morning_message: draftToHtml(convertToRaw(editorMorningState.getCurrentContent())),
                        night_message: draftToHtml(convertToRaw(editorNightState.getCurrentContent())),
                        morning_message_ar: draftToHtml(convertToRaw(editorMorningStateAr.getCurrentContent())),
                        night_message_ar: draftToHtml(convertToRaw(editorNightStateAr.getCurrentContent()))
                    }
                });

                addToast({
                    type: 'success',
                    message: formatMessage({
                        id: 'wishlist.Success',
                        defaultMessage: 'Wishlist Successfully Shared'
                    })
                });
                window.location.reload();

                if (formApiRef.current) {
                    formApiRef.current.reset();
                    setEditorMorningState(() => EditorState.createEmpty());
                    setEditorMorningStateAr(() => EditorState.createEmpty());
                    setEditorNightState(() => EditorState.createEmpty());
                    setEditorNightStateAr(() => EditorState.createEmpty());
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
            setIsSubmitting(false);
        },
        [
            addToast,
            client?.cache,
            editorMorningState,
            editorMorningStateAr,
            editorNightState,
            editorNightStateAr,
            formatMessage,
            id,
            submitForm
        ]
    );

    const errors = useMemo(() => new Map([['contactMutation', contactError]]), [contactError]);

    return {
        errors,
        setFormApi,
        handleSubmit,
        isSubmitting,
        handleAddAllProduct,
        isAddingItemsToCart,
        setEditorMorningState,
        editorMorningState,
        setEditorNightState,
        editorNightState,
        setEditorMorningStateAr,
        editorMorningStateAr,
        setEditorNightStateAr,
        editorNightStateAr
    };
};

/**
 * JSDoc type definitions
 */

/**
 * Props data to use when rendering the Wishlist component.
 *
 * @typedef {Object} WishListProps
 *
 * @property {Function} handleContentToggle Callback to handle list expand toggle
 * @property {Boolean} isOpen Boolean which represents if the content is expanded or not
 * @property {Array} items list of items
 * @property {Boolean} isLoading Boolean which represents if is in loading state
 * @property {Boolean} isFetchingMore Boolean which represents if is in loading more state
 * @property {Function} handleLoadMore Callback to load more items
 */
