import { Form } from 'informed';
import React, { Fragment, useEffect, useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { Redirect, useHistory } from 'react-router-dom';

import { LeftArrow } from '@app/components/Icons';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { scrollIntoViewWithOffset } from '@app/util/scrollIntoView';
import Button from '@magento/venia-ui/lib/components/Button';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import Authenticate from './Auth';
import SurveySuccessScreen from './successScreen';
import Question from './Survey/question';
import classes from './surveyPage.module.css';
import { useSurveyPage } from './useSurveyPage';

const SurveyPage = () => {
    const {
        survey,
        loading,
        tabCount,
        activeTab,
        submittedTabs,
        toggleTab,
        togglePreviousTab,
        toggleNextTab,
        authState,
        handleCreateAccount,
        handleSignIn,
        setFormApi,
        isUserSignedIn,
        handleSubmit,
        isAuthBusy,
        isSubmitting,
        isSuccess
    } = useSurveyPage();

    const history = useHistory();
    const { isMobileScreen } = useScreenSize();
    const formRef = useRef();

    useEffect(() => {
        if (formRef?.current && activeTab !== 0) {
            scrollIntoViewWithOffset(formRef?.current, 40);
        }
    }, [activeTab]);

    const redirectToHome = () => {
        history.push('/');
    };

    const tabClass = index => {
        if (activeTab === index) {
            return classes.tabActive;
        }
        if (submittedTabs[index]) {
            return classes.tabSubmitted;
        }
        if (submittedTabs[index - 1] && !submittedTabs[index + 1]) {
            return classes.tabCurrent;
        }

        return classes.tab;
    };

    const headerBanner = (
        <div className={classes.header}>
            <div className={classes.headerContainer}>
                {loading ? (
                    <Shimmer classes={{ root_rectangle: classes.descriptionTitleShimmer }} />
                ) : (
                    <h1 className={classes.pageTitle}>{survey?.title}</h1>
                )}
                {loading ? (
                    <Shimmer classes={{ root_rectangle: classes.descriptionShimmer }} />
                ) : (
                    <div>{survey?.description}</div>
                )}
            </div>
        </div>
    );

    const questions =
        !loading &&
        survey?.questions?.map((question, index) => (
            <Question
                key={index}
                index={index + 1}
                id={question.question_id}
                activeTab={activeTab}
                title={question.title}
                description={question.description}
                total={survey?.questions.length}
                answers={question.answers}
                type={question.type}
                isRequired={question.is_require}
                maxAnswers={question.max_answers}
                hasOtherField={question.has_other_field}
                handlePreviousTab={togglePreviousTab}
                handleNextTab={toggleNextTab}
            />
        ));

    const tabList = useMemo(
        () =>
            !loading &&
            submittedTabs &&
            new Array(tabCount + 1).fill('x').map(
                (item, i) =>
                    tabCount === i ? (
                        <button
                            key={i}
                            id={`tab${i}`}
                            className={tabClass(i)}
                            onClick={() => !(!submittedTabs[i] && !submittedTabs[i - 1]) && toggleTab(i)}
                            role="tab"
                            type="button"
                            aria-controls="tabpanel"
                        >
                            <span />
                        </button>
                    ) : (
                        <>
                            <button
                                key={i}
                                id={`tab${i}`}
                                className={tabClass(i)}
                                onClick={() => !(!submittedTabs[i] && !submittedTabs[i - 1]) && toggleTab(i)}
                                role="tab"
                                type="button"
                                aria-controls="tabpanel"
                            >
                                <span />
                            </button>
                            <span className={classes.separator} />
                        </>
                    )
                /* eslint-disable react-hooks/exhaustive-deps */
            ),
        [loading, activeTab, submittedTabs, tabCount]
    );

    if (!survey && !loading) {
        return <Redirect to="/" />;
    }

    const welcomeTab = !loading && (
        <div className={activeTab !== 0 ? classes.hidden : ''} role="tabpanel" id="tabpanel">
            <div className={classes.contentContainer}>
                <div className={classes.counter}>
                    <span>1</span>
                    <span> / </span>
                    <span>{tabCount + 1}</span>
                </div>
                <h4 className={classes.tabTitle}>
                    <span>{survey?.title}</span>
                </h4>
                <p className={classes.description}>{survey?.description}</p>
            </div>
            <div className={classes.actionContainer}>
                <Button
                    priority="high"
                    type="button"
                    classes={{ root_highPriority: classes.nextAction }}
                    onClick={() => toggleNextTab()}
                >
                    <FormattedMessage id="surveyPage.startTest" defaultMessage="Start Test" />
                </Button>
                <button type="button" className={classes.backAction} onClick={() => redirectToHome()}>
                    {!isMobileScreen && <Icon classes={{ root: classes.reset }} src={LeftArrow} />}
                    <span className={classes.backActionLabel}>
                        <FormattedMessage id="surveyPage.backToStore" defaultMessage="Back To Store" />
                    </span>
                </button>
            </div>
        </div>
    );

    const signInPlaceholder =
        authState === 'SIGN_IN' ? (
            <FormattedMessage id="surveyPage.signIn" defaultMessage="sign in" />
        ) : (
            <button className={classes.switchAuthState} type="button" onClick={handleSignIn}>
                <FormattedMessage id="surveyPage.signIn" defaultMessage="sign in" />
            </button>
        );

    const createAccountPlaceholder =
        authState === 'CREATE_ACCOUNT' ? (
            <FormattedMessage id="surveyPage.createAccount" defaultMessage="create an account" />
        ) : (
            <button className={classes.switchAuthState} type="button" onClick={handleCreateAccount}>
                <FormattedMessage id="surveyPage.createAccount" defaultMessage="create an account" />
            </button>
        );

    const authTab = (
        <div className={activeTab !== tabCount ? classes.hidden : ''} role="tabpanel" id="tabpanel">
            <div className={classes.contentContainer}>
                <div className={classes.counter}>
                    <span>{tabCount + 1}</span>
                    <span> / </span>
                    <span>{tabCount + 1}</span>
                </div>
                <h4 className={classes.tabTitle}>
                    <FormattedMessage defaultMessage="Almost finished" id="surveyPage.almostFinishedTitle" />
                </h4>
                <span className={classes.description}>
                    <FormattedMessage
                        defaultMessage="Our skincare therapists will soon commence with their analysis of your skin test, but first we need
                    your consent."
                        id="surveyPage.almostFinishedDescription"
                    />
                </span>
                {!isUserSignedIn && (
                    <span>
                        {' '}
                        <FormattedMessage
                            defaultMessage="If you have an account just {signInPlaceholder} or {createAccountPlaceholder}."
                            id="surveyPage.almostFinishedSignIn"
                            values={{
                                signInPlaceholder,
                                createAccountPlaceholder
                            }}
                        />
                    </span>
                )}
            </div>
            {!isUserSignedIn && !isAuthBusy && <Authenticate authState={authState} isAuthBusy={isAuthBusy} />}
            {isAuthBusy ||
                (isSubmitting && (
                    <LoadingIndicator global={true}>
                        <FormattedMessage id="authenticate.loadingText" defaultMessage="Loading..." />
                    </LoadingIndicator>
                ))}
            <div className={classes.actionContainer}>
                <Button priority="high" classes={{ root_highPriority: classes.nextAction }} type="submit">
                    <FormattedMessage id="surveyPage.sendButton" defaultMessage="Send" />
                </Button>
                <button type="button" className={classes.backAction} onClick={() => togglePreviousTab()}>
                    {!isMobileScreen && <Icon classes={{ root: classes.reset }} src={LeftArrow} />}
                    <span>
                        <FormattedMessage id="question.backButton" defaultMessage="Back" />
                    </span>
                </button>
            </div>
        </div>
    );

    return (
        <Fragment>
            <StoreTitle>{survey?.title || 'Survey'}</StoreTitle>
            {headerBanner}
            <section className={classes.root}>
                {survey?.backgroundImage && (
                    <div
                        className={classes.background}
                        style={{ backgroundImage: `url("${survey?.backgroundImage}")` }}
                    />
                )}
                <div className={classes.container}>
                    <div className={classes.formContainer} ref={formRef}>
                        {isSuccess ? (
                            <SurveySuccessScreen
                                successText={survey?.successText}
                                successTitle={survey?.successTitle}
                            />
                        ) : loading ? (
                            <LoadingIndicator>
                                <FormattedMessage id="surveyPage.preparing" defaultMessage="Preparing survey..." />
                            </LoadingIndicator>
                        ) : (
                            <>
                                <div className={classes.tabListContainer} role="tablist">
                                    {tabList}
                                </div>
                                <span className={classes.line} />
                                <Form id="survey" getApi={setFormApi} onSubmit={handleSubmit}>
                                    {welcomeTab}
                                    {questions}
                                    {authTab}
                                </Form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default SurveyPage;
