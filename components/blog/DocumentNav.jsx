"use client";
import { useActiveHash } from "@/app/hooks/useActiveHash";
import { parseHeadingId } from "@/utils/parseHeadingId";
import Link from "next/link";

const DocumentNav = ({ content }) => {
  const parsedHeadingIds = content
    .split("\n\n")
    .map((item) => item.replace(/[\n\r]/g, ""))
    .filter((item) => item.startsWith("##"))
    .map((item) => parseHeadingId([item]))
    .filter((item) => item);

  console.log(parsedHeadingIds);
  const activeHash = useActiveHash(
    parsedHeadingIds.map((heading) => heading?.headingId)
  );

  return parsedHeadingIds.length ? (
    <aside className="sticky h-[calc(100vh-3rem)] overflow-y-auto top-2">
      <h2>on this page</h2>
      <hr className="my-4 border-accent"></hr>
      <nav>
        {parsedHeadingIds.map((heading, idx) => (
          <Link
            key={`${idx} ${heading?.title}`}
            href={`#${heading?.headingId}`}
            className={`inline-block w-full text-sm  ${
              activeHash === heading?.headingId ? "text-white" : "text-accent"
            }`}
          >
            <span
              className={`inline-block w-full text-sm py-2 ${
                activeHash === heading?.headingId ? "text-white" : "text-accent"
              } hover:bg-accent hover:text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition-colors duration-200`}
            >
              {heading?.title}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  ) : null;
};

export default DocumentNav;
