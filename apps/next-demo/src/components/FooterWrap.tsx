'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@fv-sdk-demos/ui-shared';
export default function FooterWrap() {
  const pathName = usePathname();
  return <Footer pathName={pathName} />;
}
