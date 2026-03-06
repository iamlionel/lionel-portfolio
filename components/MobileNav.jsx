"use client";

import { links } from "@/app/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiMenuFries } from "react-icons/ci";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/context/LanguageContext";

const MobileNav = () => {
  const pathname = usePathname();
  const { locale, setLanguage, t } = useTranslation();
  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-[32px] text-accent" />
      </SheetTrigger>
      <SheetContent className="flex flex-col items-center">
        <div className="mt-20 flex flex-col items-center gap-12">
          <Link href="/">
            <h1 className="text-4xl font-semibold">
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
                    "text-accent border-b-2 border-accent"
                  } text-xl capitalize hover:text-accent transition-all`}
                >
                  {t(`nav.${link.name}`)}
                </Link>
              );
            })}
          </nav>

          {/* language switcher */}
          <div className="w-[80px] mt-4">
            <Select onValueChange={setLanguage} value={locale}>
              <SelectTrigger className="h-9 bg-[#1c1c22] border-accent text-accent focus:ring-accent focus:ring-offset-0 uppercase">
                <SelectValue placeholder="EN" />
              </SelectTrigger>
              <SelectContent className="bg-[#1c1c22] border-accent text-accent min-w-[80px]">
                <SelectGroup>
                  <SelectItem className="hover:bg-accent-hover" value="en">
                    EN
                  </SelectItem>
                  <SelectItem className="hover:bg-accent-hover" value="zh">
                    ZH
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
