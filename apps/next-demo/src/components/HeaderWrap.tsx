'use client';

import { Header, useIsMobile } from '@fv-sdk-demos/ui-shared';
import Nav, { MobileMenu } from './Nav';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const HeaderWrap = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile(992);

  console.log('isMobile', isMobile);

  return (
    <div>
      <Header
        Nav={() => <Nav setIsOpen={setIsOpen} isOpen={isOpen} />}
        Logo={() => (
          <Link href="/">
            <Image
              src="/images/FvLogo.svg"
              alt="Logo"
              height={24}
              width={113}
            />
          </Link>
        )}
      />
      {isOpen && isMobile && <MobileMenu setIsOpen={setIsOpen} />}
    </div>
  );
};
