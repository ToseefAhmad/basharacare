import { func, string, shape } from 'prop-types';
import React, { Fragment, Suspense, useEffect } from 'react';
import { Edit2 as EditIcon } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import LinkButton from '@app/components/overrides/LinkButton';
import { useShippingInformation } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useShippingInformation';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import AddressForm from './AddressForm';
import Card from './card';
import defaultClasses from './shippingInformation.module.css';

const EditModal = React.lazy(() => import('./editModal'));

const ShippingInformation = ({
    classes: propClasses,
    onSave,
    onSuccess,
    toggleActiveContent,
    toggleSignInContent,
    setGuestSignInUsername,
    setDoneEditingTheForm,
    ...props
}) => {
    const talonProps = useShippingInformation({
        onSave,
        toggleActiveContent,
        setDoneEditingTheForm
    });
    const { doneEditing, handleEditShipping, hasUpdate, isSignedIn, isLoading, shippingData } = talonProps;

    const classes = useStyle(defaultClasses, propClasses);

    const rootClassName = !doneEditing ? classes.root_editMode : hasUpdate ? classes.root_updated : classes.root;

    useEffect(() => {
        setDoneEditingTheForm(doneEditing);
    }, [setDoneEditingTheForm, doneEditing]);

    if (isLoading) {
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                <FormattedMessage id="shippingInformation.loading" defaultMessage="Fetching Shipping Information..." />
            </LoadingIndicator>
        );
    }

    const editModal = !isSignedIn ? (
        <Suspense fallback={null}>
            <EditModal
                {...props}
                onSuccess={onSuccess}
                shippingData={shippingData}
                toggleSignInContent={toggleSignInContent}
                setGuestSignInUsername={setGuestSignInUsername}
            />
        </Suspense>
    ) : null;

    const shippingInformation = doneEditing ? (
        <Fragment>
            <div className={classes.cardHeader}>
                <h5 className={classes.cardTitle}>
                    <FormattedMessage id="shippingInformation.cardTitle" defaultMessage="Shipping Information" />
                </h5>
                <LinkButton
                    onClick={handleEditShipping}
                    className={classes.editButton}
                    data-cy="ShippingInformation-editButton"
                >
                    <Icon size={16} src={EditIcon} classes={{ icon: classes.editIcon }} />
                    <span className={classes.editText}>
                        <FormattedMessage id="global.editButton" defaultMessage="Edit" />
                    </span>
                </LinkButton>
            </div>
            <Card shippingData={shippingData} />
            {editModal}
        </Fragment>
    ) : (
        <Fragment>
            <h3 className={classes.editTitle}>
                <FormattedMessage id="shippingInformation.editTitle" defaultMessage="1. Shipping Information" />
            </h3>
            <div className={classes.editWrapper}>
                <AddressForm
                    {...props}
                    onSuccess={onSuccess}
                    shippingData={shippingData}
                    toggleSignInContent={toggleSignInContent}
                    setGuestSignInUsername={setGuestSignInUsername}
                />
            </div>
        </Fragment>
    );

    return (
        <div className={rootClassName} data-cy="ShippingInformation-root">
            {shippingInformation}
        </div>
    );
};

export default ShippingInformation;

ShippingInformation.propTypes = {
    classes: shape({
        root: string,
        root_editMode: string,
        cardHeader: string,
        cartTitle: string,
        editWrapper: string,
        editTitle: string,
        editButton: string,
        editIcon: string,
        editText: string
    }),
    onSave: func.isRequired,
    onSuccess: func.isRequired,
    toggleActiveContent: func.isRequired,
    toggleSignInContent: func.isRequired,
    setGuestSignInUsername: func.isRequired
};
