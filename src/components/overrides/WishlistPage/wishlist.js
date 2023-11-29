import { Form } from 'informed';
import { bool, shape, string, number } from 'prop-types';
import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { FormattedMessage, useIntl } from 'react-intl';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Button from '../Button';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import { useWishlist } from './useWishlist';
import defaultClasses from './wishlist.module.css';
import WishlistItems from './wishlistItems';

/**
 * A single wishlist container.
 *
 * @param {Object} props.data the data for this wishlist
 * @param {boolean} props.shouldRenderVisibilityToggle whether or not to render the visiblity toggle
 * @param {boolean} props.isCollapsed whether or not is the wishlist unfolded
 */
const Wishlist = props => {
    const { data, isSender, isCollapsed, items, loading, updateItems, id } = props;
    const { formatMessage } = useIntl();
    const { items_count: itemsCount, name, sharing_code } = data;

    const talonProps = useWishlist({ id, itemsCount, isCollapsed, sharing_code });
    const {
        handleSubmit,
        isSubmitting,
        setFormApi,
        handleAddAllProduct,
        isAddingItemsToCart,
        setEditorMorningState,
        editorMorningState,
        setEditorNightState,
        editorNightState,
        setEditorMorningStateAr,
        editorMorningStateAr,
        setEditorNightStateAr,
        editorNightStateAr
    } = talonProps;
    const [isExpanded, setIsExpanded] = useState(false);

    const classes = useStyle(defaultClasses, props.classes);
    const isItemsInWishlist = !!items?.length;

    if (loading) return <LoadingIndicator />;
    const contentMessageElement = isItemsInWishlist ? (
        <>
            <WishlistItems items={items} wishlistId={id} isSender={isSender} updateItems={updateItems} />
        </>
    ) : (
        <p className={classes.emptyListText}>
            <FormattedMessage id="wishlist.emptyListText" defaultMessage="There are currently no items in this list" />
        </p>
    );

    const wishlistIdLabel = isSender && <span className={classes.wishlistId}>{` (${id})`}</span>;

    const wishlistName = name ? (
        <div className={classes.nameContainer}>
            <h2 className={classes.name} data-cy="Wishlist-name">
                {name}
            </h2>
        </div>
    ) : (
        <div className={classes.nameContainer}>
            <h2 className={classes.nameHeading}>
                <FormattedMessage id="wishlist.nameHeading" defaultMessage="WishList" />
                {wishlistIdLabel}
            </h2>
        </div>
    );

    const senderContentClass = isExpanded ? classes.shareFormContent : classes.shareFormContentCollapsed;

    const expandContent = () => {
        setIsExpanded(!isExpanded);
    };

    const senderContent = isSender ? (
        <div className={senderContentClass}>
            <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                <Field
                    autoComplete="email-addresses"
                    id="email-addresses"
                    label={formatMessage({
                        id: 'wishlist.emailAddressesLabel',
                        defaultMessage: 'Email addresses, separated by commas'
                    })}
                >
                    <TextArea field="emails" id="email-addresses" validate={isRequired} />
                </Field>
                <Field
                    id="wishlist-coupon"
                    label={formatMessage({
                        id: 'wishlist.couponLabel',
                        defaultMessage: 'Coupon Code'
                    })}
                >
                    <TextInput
                        autoComplete="comment"
                        field="coupon_code"
                        id="wishlist-coupon"
                        validate={isRequired}
                        placeholder={formatMessage({
                            id: 'wishlist.couponLabel',
                            defaultMessage: `Coupon Code`
                        })}
                        data-cy="comment"
                    />
                </Field>
                <fieldset className={classes.fieldset}>
                    <legend className={classes.legend}>
                        <FormattedMessage id="wishListPage.fieldsetEnglish" defaultMessage="English Translate" />
                    </legend>
                    <Field
                        id="wishlist-morning-message"
                        label={formatMessage({
                            id: 'wishlist.morningMessageLabel',
                            defaultMessage: 'Morning message'
                        })}
                    >
                        <Editor
                            editorState={editorMorningState}
                            onEditorStateChange={setEditorMorningState}
                            editorClassName={classes.editor}
                            toolbar={{
                                inline: { inDropdown: true },
                                list: { inDropdown: true },
                                textAlign: { inDropdown: true },
                                link: { inDropdown: true },
                                history: { inDropdown: true }
                            }}
                        />
                    </Field>
                    <Field
                        id="wishlist-night-message"
                        label={formatMessage({
                            id: 'wishlist.nightMessageLabel',
                            defaultMessage: 'Night message'
                        })}
                    >
                        <Editor
                            editorState={editorNightState}
                            onEditorStateChange={setEditorNightState}
                            editorClassName={classes.editor}
                            toolbar={{
                                inline: { inDropdown: true },
                                list: { inDropdown: true },
                                textAlign: { inDropdown: true },
                                link: { inDropdown: true },
                                history: { inDropdown: true }
                            }}
                        />
                    </Field>
                </fieldset>
                <fieldset className={classes.fieldset}>
                    <legend className={classes.legend}>
                        <FormattedMessage id="wishListPage.fieldsetArabic" defaultMessage="Arabic Translate" />
                    </legend>
                    <Field
                        id="wishlist-morning-message"
                        label={formatMessage({
                            id: 'wishlist.morningMessageLabel',
                            defaultMessage: 'Morning message'
                        })}
                    >
                        <Editor
                            editorState={editorMorningStateAr}
                            onEditorStateChange={setEditorMorningStateAr}
                            editorClassName={classes.editor}
                            toolbar={{
                                inline: { inDropdown: true },
                                list: { inDropdown: true },
                                textAlign: { inDropdown: true },
                                link: { inDropdown: true },
                                history: { inDropdown: true }
                            }}
                        />
                    </Field>
                    <Field
                        id="wishlist-night-message"
                        label={formatMessage({
                            id: 'wishlist.nightMessageLabel',
                            defaultMessage: 'Night message'
                        })}
                    >
                        <Editor
                            editorState={editorNightStateAr}
                            onEditorStateChange={setEditorNightStateAr}
                            editorClassName={classes.editor}
                            toolbar={{
                                inline: { inDropdown: true },
                                list: { inDropdown: true },
                                textAlign: { inDropdown: true },
                                link: { inDropdown: true },
                                history: { inDropdown: true }
                            }}
                        />
                    </Field>
                </fieldset>
                <div className={classes.buttonsContainer}>
                    <Button priority="high" type="submit" disabled={isSubmitting} data-cy="submit">
                        <FormattedMessage id="wishListPage.submit" defaultMessage="Share wish List" />
                    </Button>
                </div>
            </Form>
        </div>
    ) : null;

    const shareWishListButton =
        isSender && isItemsInWishlist ? (
            <div className={classes.shareWishlistButton}>
                <Button priority="low" onClick={expandContent}>
                    <FormattedMessage id="wishlist.shareWishlist" defaultMessage="Share Wishlist" />
                </Button>
            </div>
        ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.header}>{wishlistName}</div>
            <div>{contentMessageElement}</div>
            <div className={classes.actionButtons}>
                {shareWishListButton}
                {isItemsInWishlist ? (
                    <Button priority="low" disabled={isAddingItemsToCart} onClick={handleAddAllProduct}>
                        <FormattedMessage id="wishListPage.AddItemsToCart" defaultMessage="Add all items" />
                    </Button>
                ) : (
                    ''
                )}
            </div>
            {senderContent}
        </div>
    );
};

Wishlist.propTypes = {
    classes: shape({
        root: string,
        header: string,
        content: string,
        content_hidden: string,
        emptyListText: string,
        name: string,
        nameContainer: string,
        visibilityToggle: string,
        visibilityToggle_hidden: string,
        visibility: string,
        buttonsContainer: string,
        loadMore: string
    }),
    shouldRenderVisibilityToggle: bool,
    isCollapsed: bool,
    data: shape({
        id: string,
        items_count: number,
        name: string,
        visibility: string
    })
};

Wishlist.defaultProps = {
    data: {
        items_count: 0,
        items_v2: []
    }
};

export default Wishlist;
