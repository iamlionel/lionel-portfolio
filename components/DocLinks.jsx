'use client';
import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaMinus, FaPlus } from 'react-icons/fa';
import LinksList from './LinksList';

const DocLinks = ({ navLinks, toggleMobileAccordion }) => {
  const [openSections, setOpenSections] = useState({});
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug;

  useEffect(() => {
    setOpenSections(
      navLinks.reduce(
        (acc, navLink) => ({
          ...acc,
          [navLink.id]: checkNavLinks({
            items: navLink.items,
            pathCheck: pathname.split('#')[0],
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
    <div className="border-[2px] border-accent">
      {navLinks.map(({ id, to, items }, idx) => {
        const split = to?.split('/');
        const isActive =
          slug && split && split[split.length - 1] === slug[slug.length - 1];
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
                  idx !== navLinks.length - 1 ? 'border-b-2 border-accent' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionToggle(id);
                }}
              >
                <div
                  className={`flex-1 p-4 ${
                    items && 'border-r-2 border-accent'
                  } ${isSectionActive ? 'text-primary' : 'text-accent'} ${
                    isSectionActive ? 'bg-[#008670]' : 'bg-transparent'
                  } group-hover:bg-[#00fecf] group-hover:text-primary`}
                >
                  {to ? (
                    <Link
                      href={to}
                      className="no-underline flex"
                      onClick={toggleMobileAccordion}
                    >
                      <span>{id}</span>
                    </Link>
                  ) : (
                    <span className="flex justify-start">{id}</span>
                  )}
                </div>

                {items && (
                  <div className="min-w-[66px] flex justify-center items-center">
                    {isSectionActive ? (
                      <FaMinus className="w-6 h-6 text-accent" />
                    ) : (
                      <FaPlus className="w-6 h-6 text-accent" />
                    )}
                  </div>
                )}
              </AccordionTrigger>
              {items && (
                <AccordionContent className="border-b-2 border-accent px-0 py-4">
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
