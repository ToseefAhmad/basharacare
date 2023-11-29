import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { ToastType, useToasts } from '@app/hooks/useToasts.js';
import { useTracking } from '@app/hooks/useTracking';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { Magento2 } from '@magento/peregrine/lib/RestApi/index.js';

import { useCreateAccount } from './Auth/useCreateAccount.js';
import { useSignIn } from './Auth/useSignIn';
import { GET_SURVEY, SET_SURVEY_RESPONSE } from './survey.gql';

const { request } = Magento2;

export const useSurveyPage = () => {
    const { slug: surveyIdentifier } = useParams();
    const [, { addToast }] = useToasts();
    const [isSuccess, setIsSuccess] = useState(false);
    const { formatMessage } = useIntl();
    const { trackSurveyStep } = useTracking();

    const removeBodyClass = useCallback(() => globalThis.document.body.classList.remove('survey-page'), []);

    useEffect(() => {
        document.body.classList.add('survey-page');
        return removeBodyClass;
    }, [removeBodyClass]);

    const { data: surveyData, loading, error } = useQuery(GET_SURVEY, {
        fetchPolicy: 'cache-and-network',
        variables: { identifier: surveyIdentifier }
    });

    const [setResponse] = useMutation(SET_SURVEY_RESPONSE);

    const [{ isSignedIn }] = useUserContext();

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    // Tab state and methods (active/submitted tabs and tab navigation )

    const [activeTab, setActiveTab] = useState(0);
    const [submittedTabs, setSubmittedTabs] = useState(null);

    useEffect(() => {
        if (!submittedTabs && surveyData) {
            setSubmittedTabs(() => surveyData && new Array(surveyData.survey.questions.length + 2).fill(false));
        }
    }, [submittedTabs, setSubmittedTabs, surveyData]);

    const toggleTab = index => {
        setActiveTab(index);
    };
    const togglePreviousTab = () => {
        setActiveTab(activeTab - 1);
    };
    const toggleNextTab = () => {
        setActiveTab(activeTab + 1);
        trackSurveyStep({
            step: activeTab + 1,
            option: surveyIdentifier
        });
        if (!submittedTabs[activeTab]) {
            const updateSubmittedTabs = submittedTabs.map((item, index) => (index === activeTab ? !item : item));
            setSubmittedTabs(updateSubmittedTabs);
        }
    };

    // Auth state and methods (sign in or create account form)

    const [authState, setAuthState] = useState('SIGN_IN');

    const handleCreateAccount = () => {
        setAuthState('CREATE_ACCOUNT');
    };
    const handleSignIn = () => {
        setAuthState('SIGN_IN');
    };

    // Form submitting (customer authentication and response saving)

    const { signIn, isBusy: isSignInBusy } = useSignIn();
    const { createAccount, isBusy: isCreateAccountBusy } = useCreateAccount();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = useCallback(
        async ({ customer, ...rest }) => {
            setIsSubmitting(true);
            if (!isSignedIn) {
                try {
                    switch (authState) {
                        case 'SIGN_IN':
                            await signIn(customer);
                            break;
                        case 'CREATE_ACCOUNT':
                            await createAccount(customer);
                            break;
                    }
                } catch (e) {
                    addToast({
                        message: e.message,
                        type: ToastType.ERROR,
                        timeout: 7000
                    });
                    setIsSubmitting(false);
                    return;
                }
            }
            try {
                const response = [];
                for (const question in rest) {
                    const { id, type, other, ...restAnswers } = rest[question];
                    let answer_ids = [];
                    if (type.includes('radio')) {
                        answer_ids.push(restAnswers['a']);
                    }
                    if (type === 'file-upload' && restAnswers?.value) {
                        const result = await request('/rest/V1/skintest/upload', {
                            method: 'POST',
                            body: JSON.stringify({
                                file: {
                                    value: restAnswers.value,
                                    type: restAnswers.fileType,
                                    name: restAnswers.name
                                }
                            })
                        });

                        response.push({
                            question_id: id,
                            other_answer: other || '',
                            image: result
                        });
                        continue;
                    }

                    if (type == 'text') {
                        response.push({
                            question_id: id,
                            other_answer: other || '',
                            text: restAnswers.value
                        });
                        continue;
                    }

                    if (type.includes('checkbox')) {
                        const checkedAnswers = Object.keys(restAnswers).filter(key => restAnswers[key]);
                        answer_ids = checkedAnswers.map(checked => parseInt(checked.substring(2)));
                    }
                    response.push({
                        question_id: id,
                        answer_ids: answer_ids,
                        other_answer: other ? other : ''
                    });
                }
                try {
                    const result = await setResponse({
                        variables: {
                            response,
                            id: surveyData.survey.id
                        }
                    });

                    if (!result?.data?.setSurveyResponse) {
                        addToast({
                            type: ToastType.ERROR,
                            message: formatMessage({
                                id: 'surveyPage.error',
                                defaultMessage: `Something went wrong. Please try again later`
                            })
                        });
                    }
                    setIsSuccess(result?.data?.setSurveyResponse);
                } catch (e) {
                    addToast({
                        type: ToastType.ERROR,
                        message: e.message
                    });
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
            setIsSubmitting(false);
        },
        [isSignedIn, authState, signIn, createAccount, addToast, setResponse, surveyData?.survey?.id, formatMessage]
    );

    const isAuthBusy = useMemo(() => isSignInBusy && isCreateAccountBusy, [isSignInBusy, isCreateAccountBusy]);

    return {
        loading,
        error,
        survey: surveyData ? surveyData.survey : null,
        tabCount: surveyData && surveyData.survey.questions.length + 1,
        activeTab,
        submittedTabs,
        toggleTab,
        togglePreviousTab,
        toggleNextTab,
        authState,
        handleCreateAccount,
        handleSignIn,
        setFormApi,
        isUserSignedIn: isSignedIn,
        handleSubmit,
        isSubmitting,
        isSuccess,
        isAuthBusy,
        status: true
    };
};
