import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { parseHeadingId } from '@/utils/parseHeadingId';

const childrenIsAnImage = (children) => {
  // 实现检查children是否为图片的逻辑
  return children && children[0] && children[0].type === 'img';
};

const MDComponents = {
  p: ({ children }) => {
    if (childrenIsAnImage(children)) {
      const { src, alt = '' } = children[0].props;
      return (
        <div className="my-4">
          <Image
            src={src}
            alt={alt}
            width={700}
            height={400}
            className="rounded-lg"
          />
        </div>
      );
    }
    return (
      <p className="mb-4 text-white leading-relaxed font-sans">{children}</p>
    );
  },

  a: ({ children, href }) => {
    const isExternal =
      href.startsWith('http') && !href.includes('yourwebsite.com');
    const linkClass = 'text-accent hover:underline';

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {children}
        </a>
      );
    } else {
      return (
        <Link href={href} className={linkClass}>
          {children}
        </Link>
      );
    }
  },

  h1: ({ children }) => {
    const { children: parsedChildren, headingId } = parseHeadingId(children);
    return (
      <h1 id={headingId} className="text-4xl font-bold mt-8 mb-4">
        {parsedChildren}
      </h1>
    );
  },

  h2: ({ children }) => {
    const { children: parsedChildren, headingId } = parseHeadingId(children);
    return (
      <h2 id={headingId} className="text-3xl font-semibold mt-6 mb-3">
        {parsedChildren}
      </h2>
    );
  },

  h3: ({ children }) => {
    const { children: parsedChildren, headingId } = parseHeadingId(children);
    return (
      <h3 id={headingId} className="text-2xl font-medium mt-4 mb-2">
        {parsedChildren}
      </h3>
    );
  },

  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  ),

  pre: ({ children }) => (
    <pre className="bg-[#001626] p-4 rounded-lg overflow-x-auto my-4">
      {children}
    </pre>
  ),

  code: ({ children, className }) => (
    <code className={`bg-[#001626] rounded px-1 py-0.5 ${className}`}>
      {children}
    </code>
  ),

  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4">{children}</ol>
  ),

  li: ({ children }) => <li className="mb-1">{children}</li>,

  // 自定义组件，如Note
  note: ({ children }) => (
    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
      {children}
    </div>
  ),
};

export default MDComponents;
