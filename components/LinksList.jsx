"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const LinksList = ({ links, toggleMobileAccordion }) => {
  const pathname = usePathname();
  const params = useParams();
  const slug = params.slug;

  return (
    <div>
      {links.map(({ id, to, items }) => {
        const split = to?.split("/");
        const isActive =
          slug && split && split[split.length - 1] === slug[slug.length - 1];

        if (to) {
          return (
            <div
              key={id}
              className={`group hover:bg-white/5 py-1.5 px-6 cursor-pointer`}
            >
              <Link
                href={to}
                onClick={toggleMobileAccordion}
                className="flex items-center"
              >
                {isActive && (
                  <span className="w-2.5 h-2.5 bg-accent mr-3 flex-shrink-0" />
                )}
                <span
                  className={`text-[15px] font-secondary font-normal ${
                    isActive ? "text-accent" : "text-white"
                  } transition-colors duration-200`}
                >
                  {id}
                </span>
              </Link>
              {items && (
                <div className="mt-2">
                  <LinksList
                    links={items}
                    toggleMobileAccordion={toggleMobileAccordion}
                  />
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div
              key={id}
              className={`py-1.5 px-6 font-secondary ${
                isActive ? "text-accent" : "text-white"
              }`}
            >
              <span className="text-[15px] font-normal">{id}</span>
              {items && (
                <div className="mt-2">
                  <LinksList
                    links={items}
                    toggleMobileAccordion={toggleMobileAccordion}
                  />
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
};

export default LinksList;
