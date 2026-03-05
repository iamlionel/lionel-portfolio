'use client';
import React, { useState } from 'react';
import DocLinks from './DocLinks';

const DocsNav = ({ navLinks }) => {
  const [isMobileAccordionOpen, setMobileAccordionState] = useState(false);

  const toggleMobileAccordion = () => {
    setMobileAccordionState((prev) => !prev);
  };

  return (
    <>
      <aside className="w-full">
        <div className="hidden lg:block">
          <DocLinks
            navLinks={navLinks}
            toggleMobileAccordion={toggleMobileAccordion}
          />
        </div>
      </aside>
    </>
  );
};

export default DocsNav;
