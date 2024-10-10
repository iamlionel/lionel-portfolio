"use client";
import React, { useState } from "react";
import DocsLinks from "./DocsLinks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ChevronDown } from "lucide-react";

const DocsNav = ({ navLinks }) => {
  const [isMobileAccordionOpen, setMobileAccordionOpen] = useState(false);

  const toggleMobileAccordion = () => {
    setMobileAccordionOpen((prev) => !prev);
  };

  return (
    <aside className="w-full lg:w-[320px]">
      {/* desktop docs links */}
      <div className="hidden lg:block">
        <DocsLinks
          navLinks={navLinks}
          toggleMobileAccordion={toggleMobileAccordion}
        />
      </div>

      {/* mobile docs links */}
      <div className="block lg:hidden">
        <Accordion
          type="single"
          value={isMobileAccordionOpen ? "documentation" : ""}
        >
          <AccordionItem value="documentation">
            <AccordionTrigger
              className="flex flex-cols justify-between px-4 py-2 border-2 border-accent hover:bg-accent hover:text-primary
            data-[state=open]:bg-accent data-[state=open]:text-primary"
              onClick={toggleMobileAccordion}
            >
              <span>Documentation</span>
              <ChevronDown />
            </AccordionTrigger>
            <AccordionContent>
              <DocsLinks
                navLinks={navLinks}
                toggleMobileAccordion={toggleMobileAccordion}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
};

export default DocsNav;
