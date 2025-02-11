'use client';
import { useLayoutEffect, useState } from 'react';
import debounce from 'lodash/debounce';

const useIsMobile = (threshold = 992): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const updateSize = (): void => {
      setIsMobile(window.innerWidth < threshold);
    };
    const debouncedUpdateSize = debounce(updateSize, 250);
    window.addEventListener('resize', debouncedUpdateSize as EventListener);
    // updateSize();
    return (): void =>
      window.removeEventListener(
        'resize',
        debouncedUpdateSize as EventListener
      );
  }, [threshold]);

  return isMobile;
};

export { useIsMobile };
