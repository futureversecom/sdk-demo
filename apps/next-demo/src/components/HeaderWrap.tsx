'use client';

import { FVIcon, Header, LogoIcon, RootIcon } from '@fv-sdk-demos/ui-shared';
import Nav, { MobileMenu } from './Nav';
import { useState } from 'react';
import Link from 'next/link';
import useIsAuthed from '@/hooks/useIsAuthed';

export const HeaderWrap = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const isMobile = useIsMobile(992);

  useIsAuthed({ redirectUrl: '/' });

  return (
    <div>
      <Header
        Nav={() => <Nav setIsOpen={setIsOpen} isOpen={isOpen} />}
        Logo={() => (
          <div className="header__logo__row">
            <Link href="/">
              <div className="header__logo__row__desktop">
                <LogoIcon />
              </div>
              <div className="header__logo__row__mobile">
                <RootIcon />
                <FVIcon />
              </div>
            </Link>
            <span className="pill">Porcini</span>
          </div>
        )}
      />
      {isOpen && <MobileMenu setIsOpen={setIsOpen} />}
    </div>
  );
};
