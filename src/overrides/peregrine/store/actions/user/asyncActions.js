/* eslint-disable func-style */
import { removeCart } from '@magento/peregrine/lib/store/actions/cart';
import { clearCheckoutDataFromStorage } from '@magento/peregrine/lib/store/actions/checkout';
import actions from '@magento/peregrine/lib/store/actions/user/actions';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

const storage = new BrowserPersistence();

export const signOut = (payload = {}) =>
    async function thunk(dispatch, getState, { apolloClient }) {
        const { revokeToken } = payload;

        if (revokeToken) {
            // Send mutation to revoke token.
            try {
                await revokeToken();
            } catch (error) {
                console.error('Error Revoking Token', error);
            }
        }

        // Remove token from local storage and Redux.
        await dispatch(clearToken());
        await dispatch(actions.reset());
        await clearCheckoutDataFromStorage();
        await apolloClient.clearCacheData(apolloClient, 'cart');
        await apolloClient.clearCacheData(apolloClient, 'customer');
        await apolloClient.clearCacheData(apolloClient, 'reward');

        // Now that we're signed out, forget the old (customer) cart.
        // We don't need to create a new cart here because we're going to refresh
        // The page immediately after.
        await dispatch(removeCart());
    };

export const getUserDetails = ({ fetchUserDetails }) =>
    async function thunk(...args) {
        const [dispatch, getState] = args;
        const { user } = getState();

        if (user.isSignedIn) {
            dispatch(actions.getDetails.request());

            try {
                const { data } = await fetchUserDetails({});

                setCustomerGroup(data.customer.group_id);
                dispatch(actions.getDetails.receive(data.customer));
            } catch (error) {
                dispatch(actions.getDetails.receive(error));

                if (isInvalidUser(error)) {
                    dispatch(signOut());
                }
            }
        }
    };

export const resetPassword = ({ email }) =>
    async function thunk(...args) {
        const [dispatch] = args;

        dispatch(actions.resetPassword.request());

        // eslint-disable-next-line no-warning-comments
        // TODO: actually make the call to the API.
        // For now, just return a resolved promise.
        await Promise.resolve(email);

        dispatch(actions.resetPassword.receive());
    };

export const setToken = token =>
    async function thunk(...args) {
        const [dispatch] = args;

        // Store token in local storage.
        // eslint-disable-next-line no-warning-comments
        // TODO: Get correct token expire time from API
        // Override: Change TTL to 1 year
        storage.setItem('signin_token', token, 31536000);

        // Persist in store
        dispatch(actions.setToken(token));
    };

export const clearToken = () =>
    async function thunk(...args) {
        const [dispatch] = args;

        // Clear token from local storage
        storage.removeItem('signin_token');
        storage.removeItem('customer_group_id');

        // Remove from store
        dispatch(actions.clearToken());
    };

const setCustomerGroup = groupId => {
    if (!groupId) {
        return;
    }

    const customerGroupId = btoa(`G_${groupId}`);

    if (storage.getItem('customer_group_id') === customerGroupId) {
        return;
    }

    storage.setItem('customer_group_id', customerGroupId, 3600);
};

// Returns true if the cart is invalid.
function isInvalidUser(error) {
    return !!(
        error.graphQLErrors &&
        error.graphQLErrors.find(err => err.message.includes(`The current customer isn't authorized`))
    );
}
