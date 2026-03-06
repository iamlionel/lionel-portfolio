"use client";

import { links } from "@/app/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTranslation } from "@/context/LanguageContext";

const Nav = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  return (
    <nav className="flex gap-8">
      {links.map((link, index) => {
        return (
          <Link
            key={index}
            href={link.path}
            className={`${
              pathname === link.path && "text-accent border-b-2 border-accent"
            } capitalize font-medium hover:text-accent transition-all`}
          >
            {t(`nav.${link.name}`)}
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;
