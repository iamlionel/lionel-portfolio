import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React from 'react';

const LinksList = ({ links, toggleMobileAccordion }) => {
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug;

  return (
    <div className="px-4">
      {links.map(({ id, to, items }) => {
        const split = to?.split('/');
        const isActive =
          slug && split && split[split.length - 1] === slug[slug.length - 1];

        if (to) {
          return (
            <div
              key={id}
              className={`group pb-${
                items ? '6' : '0'
              } hover:bg-accent hover:text-white p-2 cursor-pointer`}
            >
              <Link href={to} onClick={toggleMobileAccordion} className="block">
                <span
                  className={`relative inline-block ${
                    items || isActive ? 'text-accent' : 'text-white'
                  }  ${
                    isActive ? 'before:content-["■"]' : ''
                  } group-hover:text-primary`}
                >
                  {id}
                </span>
              </Link>
              {items && (
                <LinksList
                  links={items}
                  toggleMobileAccordion={toggleMobileAccordion}
                />
              )}
            </div>
          );
        } else {
          return (
            <div key={id} className="p-2">
              <span>{id}</span>
              {items && (
                <LinksList
                  links={items}
                  toggleMobileAccordion={toggleMobileAccordion}
                />
              )}
            </div>
          );
        }
      })}
    </div>
  );
};

export default LinksList;
