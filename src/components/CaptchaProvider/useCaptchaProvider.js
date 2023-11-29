import { useQuery } from '@apollo/client';

import { GetCaptchaConfigDataQuery } from './captchaProvider.qql';

export const useCaptchaProvider = () => {
    const { data, loading } = useQuery(GetCaptchaConfigDataQuery);

    const captchaData = !loading && data;
    const captchaKey = captchaData && captchaData.storeConfig.captcha_key;
    const captchaLanguage = captchaData && captchaData.storeConfig.captcha_language;

    return {
        loading,
        captchaKey,
        captchaLanguage
    };
};
