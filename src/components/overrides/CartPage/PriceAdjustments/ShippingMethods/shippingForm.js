import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import React, { Fragment } from 'react';

import Country from '@app/components/overrides/Country';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './shippingForm.module.css';
import { useShippingForm } from './useShippingForm';

const ShippingForm = props => {
    const { selectedShippingFields, setIsCartUpdating } = props;
    const talonProps = useShippingForm({
        selectedValues: selectedShippingFields,
        setIsCartUpdating
    });
    const { errors, handleOnSubmit } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Fragment>
            <FormError errors={Array.from(errors.values)} />
            <Form className={classes.root} initialValues={selectedShippingFields} onSubmit={handleOnSubmit}>
                <Country
                    classes={{ root: classes.countryRoot }}
                    data-cy="ShippingMethods-ShippingForm-country"
                    validate={isRequired}
                    onChange={e => handleOnSubmit(e)}
                />
            </Form>
        </Fragment>
    );
};

export default ShippingForm;

ShippingForm.propTypes = {
    classes: shape({
        zip: string
    }),
    selectedShippingFields: shape({
        country: string.isRequired
    }),
    setIsFetchingMethods: func
};
