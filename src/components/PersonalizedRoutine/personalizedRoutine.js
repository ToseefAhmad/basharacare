import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import { HairCare } from '@app/components/Icons';
import CmsBlock from '@app/components/overrides/CmsBlock/cmsBlock';
import SimpleImage from '@app/components/overrides/Image/simpleImage';
import { usePersonalizedRoutine } from '@app/components/PersonalizedRoutine/usePersonalizedRoutine';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './personalizedRoutine.module.css';
import ProductsRoutine from './ProductsRoutine';
import SurveyItems from './SurveyItems';
import Tips from './Tips';

const PersonalizedRoutine = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const {
        isAddingItemsToCart,
        couponCode,
        morningMessage,
        nightMessage,
        isRtlDirection,
        items,
        cmsTopAdvisor,
        cmsBottomAdvisor,
        pageControl,
        handleAddAllProduct,
        isSender,
        responses,
        surveyItems,
        handleSetUpdateList,
        isMorningBlock,
        isNightBlock,
        isEmpty
    } = usePersonalizedRoutine();

    const couponElement = (
        <div className={classes.couponCodeWrap}>
            <div className={classes.couponCode}>
                <h3 className={classes.couponCodeTitle}>
                    <FormattedMessage id="personalizedRoutine.titleDetails" defaultMessage="Details" />
                </h3>
                <p className={classes.couponCodeDescription}>
                    <FormattedMessage
                        id="personalizedRoutine.descriptionDetails"
                        defaultMessage="We have completed our analysis based on the results from your Skin Test and have now created product
                  recommendations for you. Enjoy a <b>15% DISCOUNT</b> on your order using code <b>{couponCode}</b> valid for 2 weeks."
                        values={{
                            b: chunks => <strong>{chunks}</strong>,
                            couponCode
                        }}
                    />
                </p>
            </div>
        </div>
    );

    const routineMorningElement = isMorningBlock ? (
        <Tips
            title={<FormattedMessage id="personalizedRoutine.morningRoutineTitle" defaultMessage="Morning routine" />}
            imgPath="/pwa/static-files/morning-routine.jpg"
            imgAlt="Morning routine"
            message={morningMessage}
            rtl={isRtlDirection}
            direction={isRtlDirection === true}
        />
    ) : null;

    const routineNightElement = isNightBlock ? (
        <Tips
            title={<FormattedMessage id="personalizedRoutine.nightRoutineTitle" defaultMessage="Night routine" />}
            imgPath="/pwa/static-files/night-routine.jpg"
            imgAlt="Night routine"
            message={nightMessage}
            rtl={isRtlDirection}
            direction={isRtlDirection === false}
        />
    ) : null;

    const routineElement =
        isMorningBlock || isNightBlock ? (
            <div className={classes.routineWrap}>
                <h2 className={classes.routineTitle}>
                    <FormattedMessage id="personalizedRoutine.routineTitle" defaultMessage="How to Use" />
                    <HairCare />
                </h2>
                <h3 className={classes.routineSubTitle}>
                    <FormattedMessage id="personalizedRoutine.routineSubTitle" defaultMessage="your Routine" />
                </h3>
                {routineMorningElement}
                {routineNightElement}
            </div>
        ) : null;

    const responsesElement = !isSender
        ? responses.map(({ responses }) => {
              return responses.map(({ title, answers }, index) => {
                  const { text, other_answer, image, title: titleText } = answers;
                  return (
                      <div key={index}>
                          <h5>
                              <span>{title}</span>
                          </h5>
                          {other_answer ? <p>{other_answer}</p> : null}
                          {text ? <p>{text}</p> : null}
                          {titleText ? <p>{titleText}</p> : null}
                          {image ? <SimpleImage src={image} /> : null}
                      </div>
                  );
              });
          })
        : null;

    const forCustomerElements = isEmpty ? (
        <CmsBlock
            shimmer={<Shimmer height={80} width="100%" />}
            identifiers="skin-test-routines-empty"
            classes={{
                root: classes.emptyBlockRoot
            }}
        />
    ) : (
        <Fragment>
            {cmsTopAdvisor ? (
                <CmsBlock
                    shimmer={<Shimmer height={80} width="100%" />}
                    identifiers={cmsTopAdvisor}
                    classes={{
                        root: classes.rootBlock,
                        content: classes.skinConsultantBlock
                    }}
                />
            ) : null}
            {couponElement}
            <ProductsRoutine
                isAddingItemsToCart={isAddingItemsToCart}
                handleAddAllProduct={handleAddAllProduct}
                items={items}
                pageControl={pageControl}
            />
            {routineElement}
            <CmsBlock
                shimmer={<Shimmer height={80} width="100%" />}
                identifiers="skin-test-additional-products-pro-tips"
                classes={{
                    root: classes.rootBlock,
                    content: isRtlDirection ? classes.skinAdditionalBlockRtl : classes.skinAdditionalBlock
                }}
            />
            {cmsBottomAdvisor ? (
                <CmsBlock
                    shimmer={<Shimmer height={80} width="100%" />}
                    identifiers={cmsBottomAdvisor}
                    classes={{
                        root: classes.rootBlock,
                        content: classes.skinQuestionsBlock
                    }}
                />
            ) : null}
            {responsesElement.length ? (
                <div className={classes.myLastTest}>
                    <h4 className={classes.myLastTestTitle}>
                        <FormattedMessage id="personalizedRoutine.storeTitle" defaultMessage="My Last Test Answers" />
                    </h4>
                    <div className={classes.myLastTestAnswer}>{responsesElement}</div>
                </div>
            ) : null}
        </Fragment>
    );

    return (
        <AccountPageWrapper>
            <StoreTitle>
                {formatMessage({
                    id: 'personalizedRoutine.storeTitle',
                    defaultMessage: 'My Personalized Routine'
                })}
            </StoreTitle>
            {isSender ? (
                <SurveyItems items={surveyItems} pageControl={pageControl} updateHandle={handleSetUpdateList} />
            ) : (
                forCustomerElements
            )}
        </AccountPageWrapper>
    );
};

export default PersonalizedRoutine;
