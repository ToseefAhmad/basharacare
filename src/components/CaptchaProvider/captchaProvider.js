import { node } from 'prop-types';
import React from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import './captcha.module.css';

import { useCaptchaProvider } from './useCaptchaProvider';

const CaptchaProvider = ({ children }) => {
    const { loading, captchaKey, captchaLanguage } = useCaptchaProvider();

    return (
        <>
            {!loading && (
                <GoogleReCaptchaProvider reCaptchaKey={captchaKey} language={captchaLanguage}>
                    {children}
                </GoogleReCaptchaProvider>
            )}
        </>
    );
};

CaptchaProvider.propTypes = {
    children: node.isRequired
};

export default CaptchaProvider;
