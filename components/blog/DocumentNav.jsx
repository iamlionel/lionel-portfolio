"use client";
import { parseHeadingId } from "@/utils/parseHeadingId";
import Link from "next/link";
import { useState } from "react";

const DocumentNav = ({ content }) => {
  const parsedHeadingIds = content
    .split("\n\n")
    .map((item) => item.replace(/[\n\r]/g, ""))
    .filter((item) => item.startsWith("##"))
    .map((item) => parseHeadingId([item]))
    .filter((item) => item);

  const [activeHash, setActiveHash] = useState("What does Geth do?");
  return parsedHeadingIds.length ? (
    <aside className="sticky overflow-y-auto h-[calc(100vh-3rem)]">
      <h2>on this page</h2>
      <hr className="my-4 border-accent"></hr>
      <nav>
        {parsedHeadingIds.map((heading, idx) => (
          <Link
            key={`${idx} ${heading?.title}`}
            href={`#${heading?.headingId}`}
            className={`inline-block w-full text-sm px-2 py-1 ${
              activeHash === heading?.headingId ? "text-white" : "text-accent"
            }`}
          >
            <span
              className={`inline-block w-full text-sm px-2 py-1 ${
                activeHash === heading?.headingId ? "text-white" : "text-accent"
              } hover:bg-accent hover:text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 rounded transition-colors duration-200`}
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
