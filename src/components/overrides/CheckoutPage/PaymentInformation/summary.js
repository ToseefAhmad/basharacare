import { shape, string, func } from 'prop-types';
import React from 'react';
import { Edit2 as EditIcon } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import LinkButton from '../../LinkButton';

import { useSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary';
import { useStyle } from '@magento/venia-ui/lib/classify';
import summaryPayments from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/summaryPaymentCollection';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './summary.module.css';
import { PAYMENT_ICONS } from './usePaymentMethods';

const Summary = props => {
    const { classes: propClasses, onEdit, handleEditButton } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = useSummary();

    const { isLoading, selectedPaymentMethod } = talonProps;

    if (isLoading && !selectedPaymentMethod) {
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                <FormattedMessage
                    id="checkoutPage.loadingPaymentInformation"
                    defaultMessage="Fetching Payment Information"
                />
            </LoadingIndicator>
        );
    }

    const hasCustomSummaryComp = Object.keys(summaryPayments).includes(selectedPaymentMethod.code);
    const paymentIcon = PAYMENT_ICONS[selectedPaymentMethod.code];
    if (hasCustomSummaryComp) {
        const SummaryPaymentMethodComponent = summaryPayments[selectedPaymentMethod.code];
        return <SummaryPaymentMethodComponent onEdit={onEdit} />;
    } else {
        return (
            <div className={classes.root}>
                <div className={classes.heading_container}>
                    <h5 className={classes.heading}>
                        <FormattedMessage id="checkoutPage.paymentInformation" defaultMessage="Payment Information" />
                    </h5>
                    <LinkButton className={classes.editButton} onClick={handleEditButton}>
                        <Icon size={16} src={EditIcon} classes={{ icon: classes.editIcon }} />
                        <span className={classes.editButtonText}>
                            <FormattedMessage id="global.editButton" defaultMessage="Edit" />
                        </span>
                    </LinkButton>
                </div>
                <div className={classes.card_details_container}>
                    <span className={classes.payment_details}>{selectedPaymentMethod.title}</span>
                    {paymentIcon && (
                        <div className={classes.paymentIcon}>
                            <Image src={paymentIcon} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
};

export default Summary;

Summary.propTypes = {
    classes: shape({
        root: string,
        heading_container: string,
        heading: string,
        card_details_container: string,
        payment_details: string
    }),
    onEdit: func.isRequired
};
