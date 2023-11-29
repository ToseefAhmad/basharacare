import { useMemo, useState, useEffect, useCallback } from 'react';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { useLocation } from 'react-router-dom';
import { BLOG_URLS_BY_SECTION, PAGE_TYPES } from '@amasty/blog-pro/src/constants';
import { useEventListener } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const DEVICE_TYPES = {
  MOBILE: 'mobile',
  DESKTOP: 'desktop'
};

const DRAWER = 'amBlogSide';

const getLayoutInfo = layout => JSON.parse(layout);

export const usePageBuilder = () => {
  const { settings, pageType } = useAmBlogProContext();
  const { pathname } = useLocation();

  const [deviceType, setDeviceType] = useState(DEVICE_TYPES.MOBILE);

  const isHomePage =
    pathname.replace(/\/\/?$/, '') === BLOG_URLS_BY_SECTION.HOME;

  const isMobile = deviceType === DEVICE_TYPES.MOBILE;
  const layoutType = pageType === PAGE_TYPES.POST ? 'post' : 'list';

  const setDeviceTypeHandler = useCallback(() => {
    const width = window.innerWidth;
    const device = width < 1024 ? DEVICE_TYPES.MOBILE : DEVICE_TYPES.DESKTOP;
    return setDeviceType(device);
  }, [setDeviceType]);

  const layout = useMemo(() => {
    return getLayoutInfo(
      settings[`layout_${deviceType}_${layoutType}`] ||
        settings.layout_desktop_list
    );
  }, [deviceType, settings, layoutType]);

  const sections = useMemo(() => {
    const { content, left_side, right_side } = layout;

    if (isMobile) {
      return {
        main: content
      };
    }

    return {
      leftSide: left_side,
      main: content,
      rightSide: right_side
    };
  }, [layout, isMobile]);

  const layoutStyle = useMemo(() => {
    const { content, left_side, right_side } = layout;
    const hasLeftSide = !!left_side.length;
    const hasRightSide = !!right_side.length;

    const gridTemplateColumns = isMobile
      ? 'auto'
      : `${hasLeftSide ? 'auto' : ''} 1fr ${hasRightSide ? 'auto' : ''}`;

    let gridTemplateAreas = '';

    const defaultAreas =
      layoutType === 'post' ? ['breadcrumbs'] : ['breadcrumbs', 'heading'];

    if (isHomePage) {
      defaultAreas.push('featured');
    }

    if (isMobile) {
      defaultAreas.splice(1, 0, 'swipeBtn');
      const areas = [...defaultAreas, ...content];
      areas.forEach(area => {
        gridTemplateAreas += `"${area}"\n`;
      });
    } else {
      defaultAreas.forEach(area => {
        gridTemplateAreas += `"${hasLeftSide ? area : ''} ${area} ${
          hasRightSide ? area : ''
        }"`;
      });

      for (let i = 0; i < content.length; i += 1) {
        gridTemplateAreas += `\n"${hasLeftSide ? 'leftSide' : ''} ${
          content[i]
        } ${hasRightSide ? 'rightSide' : ''}"`;
      }

      gridTemplateAreas += `\n"${hasLeftSide ? 'leftSide' : ''} . ${
        hasRightSide ? 'rightSide' : ''
      }"`;
    }

    return {
      gridTemplateColumns,
      gridTemplateAreas
    };
  }, [layout, isHomePage, isMobile, layoutType]);

  const mobileAsideLayout = useMemo(() => {
    if (!isMobile) return null;
    const { left_side, right_side } = layout;
    return {
      position: left_side.length ? 'left' : 'right',
      components: left_side.length ? left_side : right_side
    };
  }, [isMobile, layout]);

  const [
    { drawer },
    { toggleDrawer, closeDrawer: handleClose }
  ] = useAppContext();

  const handleOpen = useCallback(() => toggleDrawer(DRAWER), [toggleDrawer]);

  useEffect(() => {
    handleClose();
  }, [pathname, handleClose]);

  useEventListener(window, 'resize', setDeviceTypeHandler);
  useEffect(setDeviceTypeHandler, [setDeviceTypeHandler]);

  return {
    sections,
    layoutStyle,
    isMobile,
    mobileAsideLayout,
    isOpen: drawer === DRAWER && isMobile,
    handleOpen,
    handleClose
  };
};
