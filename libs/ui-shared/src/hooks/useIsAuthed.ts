'use client';

import { useAuth } from '@futureverse/auth-react';
import { useRouter, usePathname } from 'next/navigation';

import { useEffect, useMemo } from 'react';

export default function useIsAuthed({ redirectUrl }: { redirectUrl: string }) {
  const { userSession, isFetchingSession } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthed = useMemo(
    () => !isFetchingSession && !!userSession,
    [isFetchingSession, userSession]
  );

  useEffect(() => {
    if (!isFetchingSession && !userSession && pathname !== redirectUrl) {
      router.push(redirectUrl);
    }
  }, [isFetchingSession, userSession, redirectUrl, router, pathname]);

  return { isAuthed };
}
