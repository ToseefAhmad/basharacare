import { shape, string, bool, array, func, object } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import Dialog from '../Dialog';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/AccountInformationPage/editModal.module.css';
import FormError from '@magento/venia-ui/lib/components/FormError';

import EditForm from './editForm';

const EditModal = props => {
    const {
        classes: propClasses,
        formErrors,
        onCancel,
        onChangePassword,
        onSubmit,
        initialValues,
        isDisabled,
        isOpen,
        shouldShowNewPassword,
        genderItems
    } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const dialogFormProps = { initialValues };

    return (
        <Dialog
            classes={{ body: classes.bodyEditAccountInformation }}
            confirmText="Save"
            formProps={dialogFormProps}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onSubmit}
            shouldDisableAllButtons={isDisabled}
            shouldDisableConfirmButton={isDisabled}
            shouldUnmountOnHide={true}
            title={formatMessage({
                id: 'accountInformationPage.editAccount',
                defaultMessage: 'Edit Account Information'
            })}
        >
            <FormError classes={{ root: classes.errorContainer }} errors={formErrors} />
            <EditForm
                handleChangePassword={onChangePassword}
                shouldShowNewPassword={shouldShowNewPassword}
                genderItems={genderItems}
                initialValues={initialValues}
            />
        </Dialog>
    );
};

export default EditModal;

EditModal.propTypes = {
    classes: shape({
        errorContainer: string
    }),
    formErrors: array,
    handleCancel: func,
    handleSubmit: func,
    initialValues: object,
    isDisabled: bool,
    isOpen: bool
};
