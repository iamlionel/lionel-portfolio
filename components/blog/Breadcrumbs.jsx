"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  return (
    <>
      {pathname !== "/docs" && pathSegments.length > 1 ? (
        <nav>
          <ol>
            {pathSegments.map((segment, idx) => (
              <li key={segment} className="inline-flex">
                {idx > 0 && <span className="mx-2">/</span>}
                <Link
                  href={`/${pathSegments.slice(0, idx + 1).join("/")}`}
                  className={`${
                    idx + 1 === pathSegments.length
                      ? "text-white hover:underline"
                      : "text-accent hover:underline"
                  }`}
                >
                  {segment}
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
