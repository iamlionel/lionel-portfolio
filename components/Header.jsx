"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/context/LanguageContext";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Nav from "./Nav";
import { Button } from "./ui/button";

const Header = () => {
  const { locale, setLanguage } = useTranslation();
  return (
    <header className="py-4 xl:py-8 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/*  logo */}
        <Link href="/">
          <h1 className="text-4xl font-medium">
            Lionel<span className="text-accent">.</span>
          </h1>
        </Link>

        {/*  desktop nav & hire me*/}
        <div className="hidden xl:flex gap-8 items-center">
          <Nav />
          <Link href="/blog">
            <Button className="bg-accent/80">Blog</Button>
          </Link>
          <div className="w-[52px]">
            <Select onValueChange={setLanguage} value={locale}>
              <SelectTrigger className="h-8 px-2 bg-[#1c1c22] border-accent text-accent focus:ring-accent focus:ring-offset-0 uppercase text-[10px] outline-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1c1c22] border-accent text-accent min-w-[52px] p-0">
                <SelectGroup>
                  <SelectItem
                    className="hover:bg-accent-hover cursor-pointer text-[10px] py-1 pl-6 focus:bg-accent focus:text-primary transition-all pr-2"
                    value="en"
                  >
                    EN
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-accent-hover cursor-pointer text-[10px] py-1 pl-6 focus:bg-accent focus:text-primary transition-all pr-2"
                    value="zh"
                  >
                    ZH
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
