import { usePageBuilder } from '@amasty/blog-pro/src/talons/usePagebuilder';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useAccordion = props => {
  const { accordionEnabled } = props;
  const { isMobile } = usePageBuilder();

  const isEnabled = useMemo(() => accordionEnabled && isMobile, [
    isMobile,
    accordionEnabled
  ]);

  const [isOpen, setOpenState] = useState(!isEnabled);

  const handleToggle = useCallback(() => {
    if (!isMobile || !accordionEnabled) {
      return;
    }

    setOpenState(!isOpen);
  }, [setOpenState, isOpen, isMobile, accordionEnabled]);

  useEffect(() => {
    if (isEnabled) {
      setOpenState(!isEnabled);
    }
  }, [isEnabled]);

  return {
    isOpen,
    handleToggle
  };
};
