import { Form } from 'informed';
import React, { Fragment, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import Field from '@app/components/overrides/Field';
import { useCouponCode } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/useCouponCode';
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import defaultClasses from './couponCode.module.css';

/**
 * A child component of the PriceAdjustments component.
 * This component renders a form for addingg a coupon code to the cart.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating Function for setting the updating state for the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [couponCode.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode/couponCode.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CouponCode from "@magento/venia-ui/lib/components/CartPage/PriceAdjustments/CouponCode";
 */
const CouponCode = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useCouponCode({
        setIsCartUpdating: props.setIsCartUpdating
    });
    const [, { addToast }] = useToasts();
    const { applyingCoupon, data, errors, handleApplyCoupon, handleRemoveCoupon, removingCoupon } = talonProps;
    const { formatMessage } = useIntl();

    const removeCouponError = deriveErrorMessage([errors.get('removeCouponMutation')]);
    const errorMessage = deriveErrorMessage([errors.get('applyCouponMutation')]);
    const appliedCoupons = data?.cart?.applied_coupons || false;

    useEffect(() => {
        if (removeCouponError) {
            addToast({
                type: 'error',
                message: removeCouponError,
                dismissable: true
            });
        }
    }, [addToast, removeCouponError]);

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                message: errorMessage,
                dismissable: true
            });
        }
    }, [addToast, errorMessage]);

    useEffect(() => {
        if (appliedCoupons) {
            addToast({
                type: 'success',
                message: (
                    <FormattedMessage id="couponCode.applied" defaultMessage="You successfully applied the coupon" />
                ),
                dismissable: true
            });
        }
    }, [addToast, appliedCoupons]);

    useEffect(() => {
        if (removingCoupon && !removeCouponError) {
            addToast({
                type: 'success',
                message: (
                    <FormattedMessage id="couponCode.removed" defaultMessage="You successfully removed the coupon" />
                ),
                dismissable: true
            });
        }
    }, [addToast, removingCoupon, removeCouponError]);

    if (!data) {
        return null;
    }

    if (errors.get('getAppliedCouponsQuery')) {
        return (
            <div className={classes.errorContainer}>
                <FormattedMessage
                    id="couponCode.errorContainer"
                    defaultMessage="Something went wrong. Please refresh and try again."
                />
            </div>
        );
    }

    if (appliedCoupons) {
        const codes = data.cart.applied_coupons.map(({ code }) => {
            return (
                <Fragment key={code}>
                    <span className={classes.couponCode}>{code}</span>
                    <LinkButton
                        className={classes.removeButton}
                        disabled={removingCoupon}
                        data-cy="CouponCode-removeCouponButton"
                        onClick={() => {
                            handleRemoveCoupon(code);
                        }}
                    >
                        <FormattedMessage id="couponCode.removeButton" defaultMessage="Remove" />
                    </LinkButton>
                </Fragment>
            );
        });

        return <div className={classes.appliedCoupon}>{codes}</div>;
    } else {
        const formClass = errorMessage ? classes.entryFormError : classes.entryForm;

        return (
            <Form className={formClass} onSubmit={handleApplyCoupon}>
                <Field
                    classes={{ root: classes.couponFieldEnterCode, label: classes.fieldLabel }}
                    id="couponCode"
                    label={formatMessage({
                        id: 'cartPage.couponCode',
                        defaultMessage: 'Coupon Code'
                    })}
                >
                    <TextInput
                        field="couponCode"
                        id="couponCode"
                        data-cy="CouponCode-couponCode"
                        placeholder={formatMessage({
                            id: 'couponCode.enterCode',
                            defaultMessage: 'Enter code'
                        })}
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                    />
                </Field>
                <Field classes={{ root: classes.couponFieldApply }} className={classes.applyButton}>
                    <Button data-cy="couponCode-submit" disabled={applyingCoupon} priority="normal" type="submit">
                        <FormattedMessage id="global.apply" defaultMessage="Apply" />
                    </Button>
                </Field>
            </Form>
        );
    }
};

export default CouponCode;
