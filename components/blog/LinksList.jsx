import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const LinksList = ({ links, toggleMobileAccordion }) => {
  const params = useParams();
  const slug = params?.slug;

  return (
    <div className="px-4">
      {links.map(({ id, to, items }) => {
        const split = to?.split("/");
        const isActive =
          slug && split && split[split.length - 1] === slug[slug.length - 1];

        return to ? (
          <div key={id} className={`group hover:bg-accent cursor-pointer`}>
            <Link
              href={to}
              className="block p-2"
              onClick={toggleMobileAccordion}
            >
              <span
                className={`${items || isActive ? "text-accent" : "text-white"} 
                ${isActive ? 'before:content-["■"]' : ""} 
                group-hover:text-primary`}
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
        ) : (
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
      })}
    </div>
  );
};

export default LinksList;
