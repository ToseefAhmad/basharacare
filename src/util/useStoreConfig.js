import { gql, useQuery } from '@apollo/client';
import { GET_ILN_CONFIG as IlnConfig } from 'packages/@amasty/ImprovedLayeredNavigation/src/talons/config.gql';
import { useRef } from 'react';

import { GET_LOCALE as GetLocale } from '@app/components/overrides/App/localeProvider';
import { GET_CATEGORY_URL_SUFFIX as CategoryTreeStoreConfig } from '@app/components/overrides/CategoryTree/categoryTree.gql';
import { IS_DELIVERY_DATE_ACTIVE as IsDeliveryDateActive } from '@app/components/overrides/CheckoutPage/checkoutPage.gql';
import { GET_STORE_CONFIG_DATA as StoreSwitcherConfigData } from '@app/components/overrides/Header/storeSwitcher.gql';
import { GET_STORE_CONFIG_DATA as MegaMenuConfigData } from '@app/components/overrides/MegaMenu/megaMenu.gql';
import { GET_STORE_CONFIG_DATA as MiniCartConfigData } from '@app/components/overrides/MiniCart/miniCart.gql';
import { GET_STORE_CONFIG_DATA as PriceConfigData } from '@app/components/overrides/Price/price.gql';
import { GET_WISHLIST_CONFIG as WishlistConfig } from '@app/components/overrides/ProductFullDetail/productFullDetailExtend.gql';
import { GET_ADD_THIS_PUB_ID as AddThisConfig } from '@app/components/ShareDropdown/shareDropdown.gql';
import { GET_DEFAULT_COUNTRY as GetDefaultCountry } from '@app/hooks/useDefaultCountry/useDefaultCountry.gql';
import { GET_STORE_CONFIG_DATA as ProductsConfigData } from '@app/pageBuilder/ContentTypes/Products/products.gql';
import { GET_STORE_CONFIG_DATA as ProductConfigData } from '@app/RootComponents/Product/product.gql';
import { GET_STORE_CONFIG as CarouselStoreConfig } from '@magento/pagebuilder/lib/ContentTypes/Products/Carousel/carousel.gql';
import { GET_STORE_CONFIG_DATA as BreadcrumbConfigData } from '@magento/peregrine/lib/talons/Breadcrumbs/breadcrumbs.gql';
import { GET_STORE_CONFIG_DATA as GalleryStoreConfigData } from '@magento/peregrine/lib/talons/Gallery/gallery.gql';
import navigationOperations from '@magento/peregrine/lib/talons/Navigation/navigation.gql';
import { GET_PAGE_SIZE as CategoryGetPageSize } from '@magento/venia-ui/lib/RootComponents/Category/category.gql';

const configQueries = [
    GalleryStoreConfigData,
    ProductsConfigData,
    MegaMenuConfigData,
    MiniCartConfigData,
    CategoryTreeStoreConfig,
    CategoryGetPageSize,
    StoreSwitcherConfigData,
    CarouselStoreConfig,
    navigationOperations.getRootCategoryId,
    GetLocale,
    PriceConfigData,
    BreadcrumbConfigData,
    IlnConfig,
    WishlistConfig,
    AddThisConfig,
    ProductConfigData,
    GetDefaultCountry,
    IsDeliveryDateActive
];

const getCombinedQueries = configQueries => {
    const combinedQuery = gql`
        query getAllStoreConfigs {
            storeConfig {
                id
                store_code
            }
        }
    `;

    // So that we do not get duplicate fields
    const queryFieldNames = ['id'];
    const queryInjections = combinedQuery.definitions[0].selectionSet.selections[0].selectionSet.selections;
    configQueries.forEach(function(query) {
        const queryFields = query.definitions[0].selectionSet.selections[0].selectionSet.selections;
        queryFields.forEach(function(field) {
            if (!queryFieldNames.includes(field.name.value)) {
                queryFieldNames.push(field.name.value);
                queryInjections.push(field);
            }
        });
    });

    return combinedQuery;
};

const getAllStoreConfigs = getCombinedQueries(configQueries);

export const useStoreConfig = () => {
    const initialized = useRef(false);

    useQuery(getAllStoreConfigs, {
        skip: initialized.current,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        onCompleted: () => {
            initialized.current = true;
        }
    });
};
