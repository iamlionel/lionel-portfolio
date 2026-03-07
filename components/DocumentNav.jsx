"use client";
import { parseHeadingId } from "@/utils/parseHeadingId";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DocumentNav = ({ content }) => {
  const [activeHash, setActiveHash] = useState("");
  const observer = useRef(null);
  const navRef = useRef(null);

  const parsedHeadings = (() => {
    let inCodeBlock = false;
    return content.split("\n").reduce((acc, line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return acc;
      }
      if (!inCodeBlock && trimmedLine.startsWith("##")) {
        const levelMatch = trimmedLine.match(/^(#+)/);
        const level = levelMatch ? levelMatch[0].length : 2;
        const parsed = parseHeadingId([trimmedLine]);
        if (parsed) {
          acc.push({ ...parsed, level });
        }
      }
      return acc;
    }, []);
  })();

  useEffect(() => {
    if (activeHash && navRef.current) {
      const activeElement = navRef.current.querySelector(
        `a[href="#${activeHash}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeHash]);

  useEffect(() => {
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHash(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    });

    const elements = document.querySelectorAll("h2[id], h3[id], h4[id]");
    elements.forEach((elem) => observer.current.observe(elem));

    return () => observer.current?.disconnect();
  }, [content]);

  return parsedHeadings.length ? (
    <aside
      ref={navRef}
      className="sticky h-fit max-h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain no-scrollbar top-24"
    >
      <h2 className="font-semibold text-white/90">on this page</h2>
      <hr className="my-4 border-accent/30" />
      <nav className="flex flex-col gap-1">
        {parsedHeadings.map((heading, idx) => (
          <Link
            key={`${idx} ${heading?.title}`}
            href={`#${heading?.headingId}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(heading?.headingId)?.scrollIntoView();
              setActiveHash(heading?.headingId);
            }}
          >
            <span
              className={`inline-block w-full text-sm py-1.5 rounded-md ${
                activeHash === heading?.headingId
                  ? "text-white font-medium bg-white/5"
                  : "text-accent hover:text-white/80 hover:bg-white/5"
              }`}
              style={{
                paddingLeft: `${(heading.level - 2) * 1.5 + 0.75}rem`,
              }}
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
