import { mergeDeep } from '@apollo/client/utilities';

export const CUSTOM_TYPE_POLICIES = {
    ConfigurableProduct: {
        fields: {
            price_range: {
                merge(existing, incoming) {
                    return mergeDeep(existing, incoming);
                }
            },
            configurable_options: {
                merge(_, incoming) {
                    return incoming;
                }
            }
        }
    },
    SimpleProduct: {
        fields: {
            parent_product: {
                merge: true
            },
            price_range: {
                merge(existing, incoming) {
                    return mergeDeep(existing, incoming);
                }
            }
        }
    },
    SimpleCartItem: {
        keyFields: ['uid']
    },
    ConfigurableAttributeOption: {
        keyFields: ['uid']
    },
    ConfigurableProductOptionsValues: {
        keyFields: ['uid']
    },
    CategoryTree: {
        keyFields: false,
        fields: {
            children: {
                merge(existing, incoming) {
                    return incoming;
                }
            }
        }
    }
};
