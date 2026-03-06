"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import LinksList from "./LinksList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const DocLinks = ({ navLinks, toggleMobileAccordion }) => {
  const [openSections, setOpenSections] = useState({});
  const pathname = usePathname();

  useEffect(() => {
    setOpenSections(
      navLinks.reduce(
        (acc, navLink) => ({
          ...acc,
          [navLink.id]: checkNavLinks({
            items: navLink.items,
            pathCheck: pathname.split("#")[0],
          }),
        }),
        {}
      )
    );
  }, [pathname, navLinks]);

  const handleSectionToggle = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkNavLinks = ({ items, pathCheck }) => {
    return items && items.some((item) => item.to === pathCheck);
  };

  return (
    <div className="border-[2px] border-accent rounded-sm overflow-hidden bg-transparent">
      {navLinks.map(({ id, to, items }, idx) => {
        const isSectionActive = !!openSections[id];

        return (
          <Accordion
            key={id}
            type="single"
            collapsible
            value={openSections[id] ? id : undefined}
            onValueChange={(value) => handleSectionToggle(id)}
          >
            <AccordionItem value={id} className="border-none">
              <AccordionTrigger
                className={`flex justify-between p-0 group ${
                  idx !== navLinks.length - 1 || isSectionActive
                    ? "border-b-[2px] border-accent"
                    : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionToggle(id);
                }}
              >
                <div
                  className={`flex-1 py-3 px-4 font-secondary text-[15px] font-semibold text-left ${
                    items && "border-r-[2px] border-accent"
                  } ${
                    isSectionActive
                      ? "bg-accent/40 text-primary"
                      : "bg-transparent text-accent"
                  } transition-colors duration-200`}
                >
                  {to ? (
                    <Link
                      href={to}
                      className="no-underline flex items-center h-full"
                      onClick={toggleMobileAccordion}
                    >
                      <span>{id}</span>
                    </Link>
                  ) : (
                    <span className="flex justify-start items-center h-full">
                      {id}
                    </span>
                  )}
                </div>

                {items && (
                  <div
                    className={`min-w-[50px] flex justify-center items-center bg-transparent`}
                  >
                    {isSectionActive ? (
                      <LuMinus className="w-5 h-5 text-accent" />
                    ) : (
                      <LuPlus className="w-5 h-5 text-accent" />
                    )}
                  </div>
                )}
              </AccordionTrigger>
              {items && (
                <AccordionContent
                  className={`px-0 py-4 bg-transparent ${idx !== navLinks.length - 1 ? "border-b-[2px] border-accent" : ""}`}
                >
                  <LinksList
                    links={items}
                    toggleMobileAccordion={toggleMobileAccordion}
                  />
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
};

export default DocLinks;
