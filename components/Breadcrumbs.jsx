"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <>
      {pathname !== "/docs" && pathSegments.length > 1 ? (
        <nav className="flex">
          <ol className="inline-flex">
            {pathSegments.map((segment, idx) => (
              <li key={segment} className="inline-flex">
                {idx > 0 && <span className="mx-2">/</span>}
                <Link
                  href={`/${pathSegments.slice(0, idx + 1).join("/")}`}
                  className={`${
                    idx + 1 === pathSegments.length
                      ? "text-white hover:underline"
                      : "text-accent hover:underline"
                  } font-medium`}
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      ) : (
        <div className="h-6"></div>
      )}
    </>
  );
};

export default Breadcrumbs;
