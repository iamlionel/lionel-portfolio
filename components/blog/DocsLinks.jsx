import { checkNavLinks } from "@/utils/checkNavLinks";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";
import { FaMinus, FaPlus } from "react-icons/fa";
import LinksList from "./LinksList";

const DocsLinks = ({ navLinks, toggleMobileAccordion }) => {
  const [openSections, setOpenSections] = useState({});

  const pathname = usePathname();
  const params = useParams();
  const slug = params?.slug;

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
    setOpenSections((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      console.log(`Toggling section ${id}:`, newState[id]);
      return newState;
    });
  };

  return (
    <div className="border-2 border-accent">
      {navLinks.map(({ id, to, items }, idx) => {
        const isSectionActive = !!openSections[id];

        return (
          <Accordion
            key={id}
            type="single"
            value={openSections[id] ? id : undefined}
            className="border-b-2 border-accent last:border-b-0"
          >
            <AccordionItem className="border-none" value={id}>
              <AccordionTrigger
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionToggle(id);
                }}
                className={`flex justify-between p-0`}
              >
                <div
                  className={`flex-grow p-4 border-r-2 border-accent ${
                    isSectionActive ? "bg-[#3d8470]" : ""
                  } hover:bg-accent hover:text-primary flex items-center justify-start`}
                >
                  {to ? (
                    <Link href={to}>
                      <span>{id}</span>
                    </Link>
                  ) : (
                    <span>{id}</span>
                  )}
                </div>
                {items && (
                  <div className="flex min-w-[61px] h-full items-center justify-center bg-[#040f0d]">
                    {isSectionActive ? (
                      <FaMinus className="w-6 h-6 text-accent" />
                    ) : (
                      <FaPlus className="w-6 h-6 text-accent" />
                    )}
                  </div>
                )}
              </AccordionTrigger>
              {items && (
                <AccordionContent className="border-t-2 border-accent">
                  <div className="py-4">
                    <LinksList
                      links={items}
                      toggleMobileAccordion={toggleMobileAccordion}
                    />
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
};

export default DocsLinks;
