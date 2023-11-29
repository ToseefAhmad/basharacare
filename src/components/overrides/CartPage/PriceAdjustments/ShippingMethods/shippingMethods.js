import { Form } from 'informed';
import React, { Fragment } from 'react';

import { useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingMethods';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './shippingMethods.module.css';
import ShippingRadios from './shippingRadios';

/**
 * A child component of the PriceAdjustments component.
 * This component renders the form for adding the shipping method for the cart.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating Function for setting the updating state of the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [shippingMethods.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods/shippingMethods.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import ShippingMethods from "@magento/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods";
 */
const ShippingMethods = ({ setIsCartUpdating, children, ...props }) => {
    const { hasMethods, isShowingForm, selectedShippingMethod, shippingMethods } = useShippingMethods();

    const classes = useStyle(defaultClasses, props.classes);

    const radios =
        isShowingForm && hasMethods ? (
            <Fragment>
                <Form>
                    <ShippingRadios
                        selectedShippingMethod={selectedShippingMethod}
                        setIsCartUpdating={setIsCartUpdating}
                        shippingMethods={shippingMethods}
                    />
                </Form>
            </Fragment>
        ) : null;

    return (
        <div className={classes.root} data-cy="ShippingMethods-root">
            <Fragment>
                {children}
                {radios}
            </Fragment>
        </div>
    );
};

export default ShippingMethods;
