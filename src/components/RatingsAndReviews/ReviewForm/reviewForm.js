import { Form } from 'informed';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import StarReview from '@app/components/StarReview';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './reviewForm.module.css';
import { useReviewForm } from './useReviewForm';

const ReviewForm = ({ productName, classes: propClasses, productSku }) => {
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const { handleSubmit, submitLoading, setFormApi, formSubmitResponse } = useReviewForm({ sku: productSku });

    const [showRatingError, setShowRatingError] = useState(false);

    const handleFormSubmit = data => {
        if (!starRating) {
            setShowRatingError(true);
            return;
        }

        const dataWithRating = {
            ...data,
            rating: starRating
        };

        handleSubmit(dataWithRating);
        setShowRatingError(false);
        setStarRating(null);
    };

    const [starRating, setStarRating] = useState(null);

    const formLabel = (
        <div className={classes.formLabel}>
            <FormattedMessage id="productFullDetail.reviewsFormLabel" defaultMessage={"You're reviewing:"} />
            <div>{productName}</div>
        </div>
    );

    const nameLabel = <FormattedMessage id="productFullDetail.reviewsNameLabel" defaultMessage="Nickname" />;

    const summaryLabel = <FormattedMessage id="productFullDetail.reviewsSummaryLabel" defaultMessage="Summary" />;

    const reviewLabel = <FormattedMessage id="productFullDetail.reviewsTextLabel" defaultMessage="Review" />;

    const starReviewLabel = (
        <FormattedMessage id="productFullDetail.starReviewLabel" defaultMessage="Rate this product" />
    );

    return (
        <Form getApi={setFormApi} id="review-form" onSubmit={handleFormSubmit} className={classes.root}>
            {formLabel}
            <Field id="rating">
                <StarReview
                    title={starReviewLabel}
                    showError={showRatingError}
                    setStarRating={setStarRating}
                    reset={formSubmitResponse}
                    width={40}
                    height={30}
                />
            </Field>
            <Field id="name" label={nameLabel} classes={{ root: classes.field, label: classes.inputLabel }}>
                <TextInput
                    field="nickname"
                    validate={isRequired}
                    placeholder={formatMessage({
                        id: 'productFullDetail.reviewsNamePlaceholder',
                        defaultMessage: 'Name'
                    })}
                    maxLength="30"
                    classes={{ input: classes.nameInput }}
                />
            </Field>
            <Field id="summary" label={summaryLabel} classes={{ root: classes.field, label: classes.inputLabel }}>
                <TextInput
                    field="summary"
                    validate={isRequired}
                    placeholder={formatMessage({
                        id: 'productFullDetail.reviewsSummaryPlaceholder',
                        defaultMessage: 'Summary'
                    })}
                    maxLength="30"
                    classes={{ input: classes.summaryInput }}
                />
            </Field>
            <Field id="text" label={reviewLabel} classes={{ root: classes.reviewField, label: classes.inputLabel }}>
                <TextArea
                    id="text"
                    field="text"
                    validate={isRequired}
                    placeholder={formatMessage({
                        id: 'productFullDetail.reviewsTextPlaceholder',
                        defaultMessage: 'Write your review'
                    })}
                    maxLength="2000"
                    classes={{ input: classes.reviewInput }}
                />
            </Field>

            <Button disabled={submitLoading} priority="reviewForm" type="submit" data-cy="submit">
                <FormattedMessage id="productFullDetail.reviewsSubmit" defaultMessage="write a review" />
            </Button>
        </Form>
    );
};

export default ReviewForm;
