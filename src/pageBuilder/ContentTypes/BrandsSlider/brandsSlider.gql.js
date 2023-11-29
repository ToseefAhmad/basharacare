import { gql } from '@apollo/client';

export const GET_SHOP_BRANDS = gql`
    query getBrandsSlider($identifier: String!) {
        shopByAttribute(identifier: $identifier) {
            url_page
            items {
                url_alias
                option_setting_id
                slider_image
                is_show_in_slider
            }
        }
    }
`;

export default {
    getShopBrands: GET_SHOP_BRANDS
};
