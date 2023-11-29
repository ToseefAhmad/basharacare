import { gql } from '@apollo/client';

export const GET_ILN_CONFIG = gql`
  query storeConfigData {
    storeConfig {
      id
      store_code
      amshopby_general_unfolded_options_state
      default_display_currency_code
      amshopby_general_keep_single_choice_visible
      amasty_shopby_seo_url_option_separator
      amasty_shopby_seo_url_special_char
    }
  }
`;

export default {
  getIlnConfigQuery: GET_ILN_CONFIG
};
