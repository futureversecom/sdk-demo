'use client';

import { Header, LogoIcon, useIsMobile } from '@fv-sdk-demos/ui-shared';
import Nav, { MobileMenu } from './Nav';
import { useState } from 'react';
import Link from 'next/link';
import useIsAuthed from '@/hooks/useIsAuthed';

export const HeaderWrap = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile(992);

  useIsAuthed({ redirectUrl: '/' });

  return (
    <div>
      <Header
        Nav={() => <Nav setIsOpen={setIsOpen} isOpen={isOpen} />}
        Logo={() => (
          <Link href="/">
            <LogoIcon />
          </Link>
        )}
      />
      {isOpen && isMobile && <MobileMenu setIsOpen={setIsOpen} />}
    </div>
  );
};
