import { useNavLink } from '@amasty/blog-pro/src/talons/useNavLink';

const wrapUseMegaMenu = original => props => {
    const defaultReturnData = original(props);
    const { label, isEnabled, urlKey } = useNavLink();

    const { megaMenuData, categoryUrlSuffix } = defaultReturnData;
    const getSuffix = cat => (!cat.isBlogLink ? categoryUrlSuffix : '');

    if (isEnabled) {
        const { children = [] } = megaMenuData;
        const randomId = 'blogId';

        const blogItem = {
            uid: randomId,
            include_in_menu: 1,
            isActive: false,
            name: label || '',
            url_path: urlKey,
            children: [],
            path: [randomId],
            position: 0,
            isBlogLink: true
        };

        return {
            ...defaultReturnData,
            categoryUrlSuffix: getSuffix,
            megaMenuData: {
                ...megaMenuData,
                children: [...children, blogItem]
            }
        };
    }

    return {
        ...defaultReturnData,
        categoryUrlSuffix: getSuffix
    };
};

export default wrapUseMegaMenu;
