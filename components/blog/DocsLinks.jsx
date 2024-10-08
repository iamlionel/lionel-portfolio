import { checkNavLinks } from '@/utils/checkNavLinks';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import Link from 'next/link';
import LinksList from '../LinksList';

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
            pathCheck: pathname.split('#')[0],
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
        console.log('id:' + id + ',' + isSectionActive);

        return (
          <Accordion
            key={id}
            type="single"
            value={openSections[id] ? id : undefined}
          >
            <AccordionItem className="border-none" value={id}>
              <AccordionTrigger
                onClick={(e) => {
                  e.preventDefault();
                  handleSectionToggle(id);
                }}
              >
                <div className={`flex p-4`}>
                  {to ? (
                    <Link href={to}>
                      <span>{id}</span>
                    </Link>
                  ) : (
                    <span>{id}</span>
                  )}
                </div>
              </AccordionTrigger>
              {items && (
                <AccordionContent>
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
