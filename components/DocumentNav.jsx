'use client';
import { parseHeadingId } from '@/utils/parseHeadingId';
import Link from 'next/link';
import React, { useState } from 'react';

const DocumentNav = ({ content }) => {
  const parsedHeadings = content
    .split('\n\n')
    .map((item) => item.replace(/[\n\r]/g, ''))
    .filter((item) => item.startsWith('##'))
    .map((item) => parseHeadingId([item]))
    .filter((item) => item);
  console.log(parsedHeadings);
  const [activeHash, setActiveHash] = useState('ubuntu-via-ppas');
  return (
    <aside className="sticky h-[calc(100vh-3rem)] overflow-y-auto top-4">
      <h2 className="font-semibold">on this page</h2>
      <hr className="my-4 border-accent" />
      <nav>
        {parsedHeadings.map((heading, idx) => (
          <Link
            key={`${idx} ${heading?.title}`}
            href={`#${heading?.headingId}`}
          >
            <span
              className={`inline-block w-full text-sm px-2 py-1 ${
                activeHash === heading?.headingId ? 'text-white' : 'text-accent'
              } hover:bg-accent hover:text-primary focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 rounded transition-colors duration-200`}
            >
              {heading?.title}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default DocumentNav;
