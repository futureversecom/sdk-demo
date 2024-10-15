import { useEffect, useState } from 'react';

export const useCurrentPath = () => {
  const [path, setPath] = useState('');

  useEffect(() => {
    const isNext = typeof window !== 'undefined' && 'next' in window;

    // Dynamically import only the needed router based on the environment
    const updatePath = async () => {
      if (isNext) {
        // Import Next.js router dynamically
        const { useRouter } = await import('next/router');
        const nextRouter = useRouter();
        setPath(nextRouter.asPath);

        const handleRouteChange = (url: string) => setPath(url);
        nextRouter.events.on('routeChangeComplete', handleRouteChange);

        return () => {
          nextRouter.events.off('routeChangeComplete', handleRouteChange);
        };
      } else {
        // Import React Router (for React apps using react-router-dom)
        const { useLocation } = await import('react-router-dom');
        const reactLocation = useLocation();
        setPath(reactLocation.pathname);
      }
    };

    updatePath();
  }, []);

  return path;
};
