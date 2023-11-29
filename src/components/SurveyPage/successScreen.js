import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';
import Link from '@magento/venia-ui/lib/components/Link';

import classes from './surveyPage.module.css';

const SurveySuccessScreen = ({ successText, successTitle }) => {
    return (
        <div className={classes.sucessPageRoot}>
            <h4>{successTitle || <FormattedMessage id="surveyPage.successTitle" defaultMessage="Thank you!" />}</h4>
            {successText ? (
                <p className={classes.successText}>{successText}</p>
            ) : (
                <>
                    <p>
                        <FormattedMessage
                            id="surveyPage.successDescription1"
                            defaultMessage="We are so happy to have received your skin test - you've completed an important step towards a strong and healthy skin. Our skin therapists will now look over your answers and give you product recommendation."
                        />
                    </p>
                    <p>
                        <FormattedMessage
                            id="surveyPage.successDescription2"
                            defaultMessage="We have created a customer profile for you where you can see your test results, orders and saved favourites."
                        />
                    </p>
                </>
            )}
            <div className={classes.discoverMoreButtonWrapper}>
                <Link to="/blog">
                    <Button priority="high">
                        <FormattedMessage id="surveyPage.successDiscoverButton" defaultMessage="Discover more..." />
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default SurveySuccessScreen;
