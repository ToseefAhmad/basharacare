import defaultClasses from '@amasty/blog-pro/src/components/root.module.css';
import { usePageBuilder } from '@amasty/blog-pro/src/talons/usePagebuilder';
import React, { Fragment, lazy, useMemo } from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

const components = {
    main: lazy(() => import('@amasty/blog-pro/src/components/MainContent')),
    categories: lazy(() => import('@amasty/blog-pro/src/components/CategoryTree')),
    search: lazy(() => import('@amasty/blog-pro/src/components/Search')),
    tags: lazy(() => import('@amasty/blog-pro/src/components/Tags')),
    'featured-posts': lazy(() => import('@amasty/blog-pro/src/components/FeaturedPosts')),
    'recent-comments': lazy(() => import('@amasty/blog-pro/src/components/RecentComments')),
    'recent-posts': lazy(() => import('@amasty/blog-pro/src/components/RecentPosts'))
};

const MAIN_COMPONENTS = ['list', 'grid', 'post'];

const SectionWrapper = props => {
    const { children, name } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    if (name !== 'main') {
        return <div className={classes[name]}>{children}</div>;
    }

    return <Fragment>{children}</Fragment>;
};

const PageBuilder = props => {
    const talons = usePageBuilder();
    const { sections, layoutStyle } = talons;
    const classes = mergeClasses(defaultClasses, props.classes);

    const layout = useMemo(
        () =>
            Object.keys(sections).map(key => {
                const items = sections[key];

                if (!items || !items.length) {
                    return null;
                }

                let hasMainComponent = false;

                return (
                    <SectionWrapper name={key} key={key}>
                        {items.map(item => {
                            const isMain = MAIN_COMPONENTS.includes(item);
                            const componentKey = isMain ? 'main' : item;

                            const Component = isMain && hasMainComponent ? null : components[componentKey];

                            if (isMain) {
                                hasMainComponent = true;
                            }

                            return (
                                Component && (
                                    <Component
                                        key={item}
                                        classes={{
                                            gridArea: classes[componentKey]
                                        }}
                                    />
                                )
                            );
                        })}
                    </SectionWrapper>
                );
            }),
        [sections, classes]
    );

    return (
        <article style={layoutStyle} className={classes.root}>
            {layout}
        </article>
    );
};

export default PageBuilder;
