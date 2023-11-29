import { gql } from '@apollo/client';

export const GetCaptchaConfigDataQuery = gql`
    query GetCaptchaConfigData {
        storeConfig {
            id
            captcha_key
            captcha_language
            store_code
        }
    }
`;
