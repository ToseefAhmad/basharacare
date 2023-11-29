import { bool, shape, string } from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import { Close as CloseIcon } from '@app/components/Icons';
import { useScrollLock, useToasts } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';

import operations from './miniCart.gql';
import defaultClasses from './miniCart.module.css';
import ProductList from './ProductList/productList';
import { useMiniCart } from './useMiniCart';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

/**
 * The MiniCart component shows a limited view of the user's cart.
 *
 * @param {Boolean} props.isOpen - Whether or not the MiniCart should be displayed.
 * @param {Function} props.setIsOpen - Function to toggle mini cart
 */
const MiniCart = React.forwardRef((props, ref) => {
    const { isOpen, setIsOpen } = props;

    // Prevent the page from scrolling in the background when the MiniCart is open.
    useScrollLock(isOpen);

    const talonProps = useMiniCart({
        setIsOpen,
        operations
    });

    const {
        errorMessage,
        handleProceedToCheckout,
        handleRemoveItem,
        handleUpdateItemQuantity,
        handleProductClick,
        loading,
        productList,
        configurableThumbnailSource,
        storeUrlSuffix
    } = talonProps;

    const { formatMessage } = useIntl();
    const buttonAriaLabel = formatMessage({
        id: 'miniCart.closeCartAriaLabel',
        defaultMessage: 'Close minicart'
    });

    const handleClose = () => {
        setIsOpen(false);
    };

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const contentsClass = isOpen ? classes.contents_open : classes.contents;

    const isCartEmpty = !(productList && productList.length);

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 7000
            });
        }
    }, [addToast, errorMessage]);

    const header = (
        <Fragment>
            <button aria-label={buttonAriaLabel} onClick={handleClose} className={classes.closeButton}>
                <Icon src={CloseIcon} classes={{ root: classes.iconRoot, icon: '' }} />
            </button>
            <h3 className={classes.cartTitle}>
                <FormattedMessage id="miniCart.cartTitle" defaultMessage="Your cart" />
            </h3>
        </Fragment>
    );

    const contents = isCartEmpty ? (
        <div className={classes.emptyCart}>
            <div className={classes.header}>{header}</div>
            <div className={classes.emptyMessage} data-cy="MiniCart-emptyMessage">
                <FormattedMessage
                    id="miniCart.emptyMessage"
                    defaultMessage="You have no items in your shopping cart."
                />
            </div>
        </div>
    ) : (
        <Fragment>
            <div className={classes.header}>{header}</div>
            <div className={window.innerHeight > 651 ? classes.body : classes.bodySmallHeight} data-cy="MiniCart-body">
                <ProductList
                    items={productList}
                    loading={loading}
                    handleRemoveItem={handleRemoveItem}
                    handleUpdateItemQuantity={handleUpdateItemQuantity}
                    onProductClick={handleProductClick}
                    configurableThumbnailSource={configurableThumbnailSource}
                    storeUrlSuffix={storeUrlSuffix}
                />
            </div>
            <div className={classes.footer}>
                <Button
                    onClick={handleProceedToCheckout}
                    priority="high"
                    className={classes.checkoutButton}
                    disabled={loading || isCartEmpty}
                    data-cy="Minicart-checkoutButton"
                >
                    <FormattedMessage id="miniCart.checkoutButton" defaultMessage="GO TO CHECKOUT" />
                </Button>
            </div>
        </Fragment>
    );

    return (
        <aside className={rootClass} data-cy="MiniCart-root">
            <div ref={ref} className={contentsClass}>
                {contents}
            </div>
        </aside>
    );
});

MiniCart.displayName = 'MiniCart';

export default MiniCart;

MiniCart.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        contents: string,
        contents_open: string,
        header: string,
        body: string,
        footer: string,
        checkoutButton: string,
        emptyCart: string,
        emptyMessage: string,
        stockStatusMessageContainer: string
    }),
    isOpen: bool
};
