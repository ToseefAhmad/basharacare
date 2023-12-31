import { Form } from 'informed';
import { shape, func, string, bool, instanceOf } from 'prop-types';
import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';

import { usePaymentInformation } from '@app/components/overrides/CheckoutPage/PaymentInformation/usePaymentInformation';
import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentInformation.module.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const PaymentMethods = React.lazy(() => import('./paymentMethods'));
const EditModal = React.lazy(() =>
    import('@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/editModal')
);
const Summary = React.lazy(() => import('./summary'));

const PaymentInformation = props => {
    const {
        classes: propClasses,
        onSave,
        resetShouldSubmit,
        handleReviewOrder,
        setCheckoutStep,
        reviewOrderBtnDisabled,
        shouldSubmit,
        checkoutError,
        shouldForceRefresh,
        setShouldForceRefresh,
        ...rest
    } = props;

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = usePaymentInformation({
        onSave,
        checkoutError,
        resetShouldSubmit,
        setCheckoutStep,
        shouldSubmit,
        shouldForceRefresh,
        setShouldForceRefresh
    });

    const {
        doneEditing,
        handlePaymentError,
        handlePaymentSuccess,
        handleEditButton,
        hideEditModal,
        isLoading,
        isEditModalActive,
        showEditModal
    } = talonProps;

    if (isLoading) {
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                <FormattedMessage
                    id="checkoutPage.loadingPaymentInformation"
                    defaultMessage="Fetching Payment Information"
                />
            </LoadingIndicator>
        );
    }

    const paymentInformation = doneEditing ? (
        <Summary onEdit={showEditModal} handleEditButton={handleEditButton} />
    ) : (
        <Form>
            <PaymentMethods
                {...rest}
                onPaymentError={handlePaymentError}
                onPaymentSuccess={handlePaymentSuccess}
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
                handleReviewOrder={handleReviewOrder}
                reviewOrderBtnDisabled={reviewOrderBtnDisabled}
            />
        </Form>
    );

    const editModal = doneEditing ? (
        <Suspense fallback={null}>
            <EditModal onClose={hideEditModal} isOpen={isEditModalActive} />
        </Suspense>
    ) : null;

    return (
        <div className={classes.root} data-cy="PaymentInformation-root">
            <div className={classes.payment_info_container}>
                <Suspense fallback={null}>{paymentInformation}</Suspense>
            </div>
            {editModal}
        </div>
    );
};

export default PaymentInformation;

PaymentInformation.propTypes = {
    classes: shape({
        container: string,
        payment_info_container: string,
        review_order_button: string
    }),
    onSave: func.isRequired,
    checkoutError: instanceOf(CheckoutError),
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool,
    shouldForceRefresh: bool
};
