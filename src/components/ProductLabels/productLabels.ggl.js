import { gql } from '@apollo/client';

export const GET_LABELS = gql`
    query amLabelProvider($productIds: [Int]!, $mode: AmLabelMode) {
        amLabelProvider(productIds: $productIds, mode: $mode) {
            items {
                image
                label_id
                name
                position
                product_id
                size
                style
                txt
                customer_group_ids
            }
        }
    }
`;

export const GET_LABEL_SETTING = gql`
    query amLabelSetting {
        amLabelSetting {
            product_container
            category_container
            max_labels
            show_several_on_place
            labels_alignment
            margin_between
        }
    }
`;

export default {
    getLabelSettingQuery: GET_LABEL_SETTING,
    getLabelsQuery: GET_LABELS
};
