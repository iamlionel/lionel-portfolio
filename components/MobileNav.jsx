'use client';

import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { CiMenuFries } from 'react-icons/ci';
import Link from 'next/link';
import { links } from '@/app/constant';
import { usePathname } from 'next/navigation';

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-[32px] text-accent" />
      </SheetTrigger>
      <SheetContent className="flex flex-col items-center">
        <div className="mt-32 text-2xl text-center">
          <Link href="/">
            <h1 className="text-4xl font-semibold mb-40">
              Lionel<span className="text-accent">.</span>
            </h1>
          </Link>

          {/* nav */}
          <nav className="flex flex-col justify-center items-center gap-8">
            {links.map((link, index) => {
              return (
                <Link
                  href={link.path}
                  key={index}
                  className={`${
                    link.path === pathname &&
                    'text-accent border-b-2 border-accent'
                  } text-xl capitalize hover:text-accent transition-all`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
