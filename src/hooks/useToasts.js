import { useCallback, useMemo } from 'react';

import { useToastContext } from '@magento/peregrine/lib/Toasts/useToastContext';

// By default all toasts are dismissed after a timeout unless specified by the
// Implementer via `timeout = 0` or `timeout = false`.
const DEFAULT_TIMEOUT = 10000;

export const ToastType = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    SUCCESS: 'success'
};

export const getToastId = ({ type, message, dismissable = true, actionText = '', icon = null }) => {
    const combined = [type, message, dismissable, actionText, icon].join();

    // The hashing function below should generally avoid accidental collisions.
    // It exists to give a "readable" identifier to toasts for debugging.
    let hash = 0;
    let i;
    let chr;
    if (combined.length === 0) return hash;
    for (i = 0; i < combined.length; i++) {
        chr = combined.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

export const useToasts = () => {
    const [state, dispatch] = useToastContext();

    /**
     * Removes a toast from the toast store.
     */
    const removeToast = useCallback(
        id => {
            dispatch({
                type: 'remove',
                payload: { id }
            });
        },
        [dispatch]
    );

    /**
     * Dispatches an add action. Includes all props passed along with a hash id
     * and a timeout id generated based on the incoming props.
     */
    const addToast = useCallback(
        toastProps => {
            const { dismissable, message, timeout = DEFAULT_TIMEOUT, type, onDismiss, onAction } = toastProps;

            if (!type) {
                throw new TypeError('toast.type is required');
            }

            if (!message) {
                throw new TypeError('toast.message is required');
            }

            if (!(timeout || timeout === 0 || timeout === false) && !(onDismiss || dismissable)) {
                throw new TypeError('Toast should be user-dismissable or have a timeout');
            }

            // Generate the id to use in the removal timeout.
            const id = getToastId(toastProps);

            const handleDismiss = () => {
                onDismiss ? onDismiss(() => removeToast(id)) : removeToast(id);
            };

            const handleAction = () => (onAction ? onAction(() => removeToast(id)) : () => null);

            // A timeout of 0 means no auto-dismiss.
            let removalTimeoutId;
            if (timeout !== 0 && timeout !== false) {
                removalTimeoutId = setTimeout(
                    () => {
                        handleDismiss();
                    },
                    timeout ? timeout : DEFAULT_TIMEOUT
                );
            }

            dispatch({
                type: 'add',
                payload: {
                    ...toastProps,
                    id,
                    timeout: timeout || timeout === false ? timeout : DEFAULT_TIMEOUT,
                    timestamp: Date.now(),
                    removalTimeoutId,
                    handleDismiss,
                    handleAction
                }
            });

            return id;
        },
        [dispatch, removeToast]
    );

    /**
     * The API for managing toasts.
     * Use this API to add and remove toasts.
     */
    const api = useMemo(
        () => ({
            addToast,
            dispatch,
            removeToast
        }),
        [addToast, dispatch, removeToast]
    );

    return [state, api];
};
