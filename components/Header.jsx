'use client';
import Link from 'next/link';
import Nav from './Nav';
import { Button } from './ui/button';
import MobileNav from './MobileNav';

const Header = () => {
  return (
    <header className="py-8 xl:py-12 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/*  logo */}
        <Link href="/">
          <h1 className="text-4xl font-semibold">
            Lionel<span className="text-accent">.</span>
          </h1>
        </Link>

        {/*  desktop nav & hire me*/}
        <div className="hidden xl:flex gap-8 items-center">
          <Nav />
          <Link href="/contact">
            <Button>Blog</Button>
          </Link>
        </div>

        {/* mobile nav */}
        <div className="xl:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
