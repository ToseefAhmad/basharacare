import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useDerivedClasses = ({ classes = {}, urlKey = '' } = {}) => {
    const { pathname } = useLocation();
    const urlToMatch = urlKey || pathname.slice(1);

    const derivedClasses = useMemo(() => {
        switch (urlToMatch) {
            case 'body': {
                return {
                    header: classes.categoryHeaderBody,
                    headerContainer: classes.categoryHeaderContainerBody,
                    icon: classes.categoryIconBody,
                    breadcrumbs: classes.breadcrumbRootBody
                };
            }
            case 'hair-care': {
                return {
                    header: classes.categoryHeaderHair,
                    headerContainer: classes.categoryHeaderContainerHair,
                    icon: classes.categoryIconHair,
                    breadcrumbs: classes.breadcrumbRootHair
                };
            }
            case 'skin-care': {
                return {
                    header: classes.categoryHeaderFace,
                    headerContainer: classes.categoryHeaderContainerFace,
                    icon: classes.categoryIconFace,
                    breadcrumbs: classes.breadcrumbRootFace
                };
            }
            default: {
                return {
                    header: classes.categoryHeader,
                    headerContainer: classes.categoryHeaderContainer,
                    icon: classes.categoryIcon,
                    breadcrumbs: classes.breadcrumbRoot
                };
            }
        }
    }, [classes, urlToMatch]);

    return {
        derivedClasses
    };
};
