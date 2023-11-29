import { shape, string } from 'prop-types';
import React, { useEffect, useCallback } from 'react';

import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';

import defaultClasses from './footer.module.css';

const DESKTOP_SIZE = 1024;

const Footer = ({ classes }) => {
    const isMobile = useWindowSize().innerWidth < DESKTOP_SIZE;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const footer = <CmsBlock identifiers="footer" />;

    const handleTabClick = useCallback(element => {
        element.classList.toggle('active-tab');
    }, []);

    useEffect(() => {
        const handlers = [];
        const buttonElements = document.querySelectorAll('.col-links');

        if (isMobile) {
            for (const element of buttonElements) {
                const handler = handleTabClick.bind(null, element);
                handlers.push({ element, handler });
                element.addEventListener('click', handler);
            }
        } else {
            for (const element of buttonElements) {
                element.classList.remove('active-tab');
            }
        }

        return () => {
            for (const { element, handler } of handlers) {
                element.removeEventListener('click', handler);
            }
        };
    }, [isMobile, footer, handleTabClick]);

    const rootClasses = useStyle(classes, defaultClasses);
    return (
        <footer id="footer" className={rootClasses.root}>
            <div className="footerWrapper">{footer}</div>
        </footer>
    );
};

export default Footer;

Footer.propTypes = {
    classes: shape({
        root: string
    })
};
