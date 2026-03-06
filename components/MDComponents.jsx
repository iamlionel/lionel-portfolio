import { parseHeadingId } from "@/utils/parseHeadingId";
import Image from "next/image";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const childrenIsAnImage = (children) => {
  return children && children[0] && children[0].type === "img";
};

const MDComponents = {
  // paragraphs
  p: ({ children }) => {
    if (childrenIsAnImage(children)) {
      const { src, alt = "" } = children[0].props;
      return (
        <div className="my-[40px]">
          <Image
            src={src}
            alt={alt}
            width={800}
            height={450}
            className="rounded-sm"
          />
        </div>
      );
    }
    return (
      <p className="mb-4 leading-[1.6] text-white/90 font-inter text-[16px]">
        {children}
      </p>
    );
  },

  // links
  a: ({ children, href }) => {
    const isExternal =
      href.startsWith("http") && !href.includes("geth.ethereum.org");
    const linkClass =
      "text-accent transition-colors border-b border-transparent hover:border-accent";

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

  // headings
  h1: ({ children }) => {
    const { children: parsedChildren, headingId } = parseHeadingId(children);
    return (
      <h1
        id={headingId}
        className="text-[32px] md:text-[40px] font-medium mb-4 font-secondary tracking-tight text-white"
      >
        {parsedChildren}
      </h1>
    );
  },

  h2: ({ children }) => {
    const { children: parsedChildren, headingId } = parseHeadingId(children);
    return (
      <h2
        id={headingId}
        className="text-[24px] md:text-[30px] font-normal mt-6 mb-4 font-secondary text-white"
      >
        {parsedChildren}
      </h2>
    );
  },

  h3: ({ children }) => {
    const { children: parsedChildren, headingId } = parseHeadingId(children);
    return (
      <h3
        id={headingId}
        className="text-[20px] md:text-[24px] font-normal mt-4 mb-2 font-secondary text-white"
      >
        {parsedChildren}
      </h3>
    );
  },

  h4: ({ children }) => {
    const { children: parsedChildren, headingId } = parseHeadingId(children);
    return (
      <h4
        id={headingId}
        className="text-[18px] md:text-[20px] font-normal mb-2 font-secondary text-white"
      >
        {parsedChildren}
      </h4>
    );
  },

  // tables
  table: ({ children }) => (
    <div className="flex overflow-x-auto mt-8 mb-4 border border-white/10 rounded-sm">
      <table className="min-w-full text-sm text-left font-inter divide-y divide-white/10">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
  th: ({ children }) => <th className="px-4 py-3 font-semibold">{children}</th>,
  td: ({ children }) => (
    <td className="px-4 py-3 border-t border-white/5">{children}</td>
  ),

  // pre
  pre: ({ children }) => {
    return <div className="mb-4">{children}</div>;
  },

  // code
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";

    if (inline || !match) {
      return (
        <code className="text-white font-secondary p-1 text-[0.9em] mx-[2px] bg-white/5 px-1 rounded-sm">
          {children}
        </code>
      );
    }

    return (
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        PreTag="div"
        customStyle={{
          margin: 0,
          background: "#232329",
          padding: "20px",
          borderRadius: "4px",
          fontSize: "14px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
        }}
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  },

  // lists
  ul: ({ children }) => (
    <ul className="list-disc mb-6 px-6 space-y-2 text-white/90">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal mb-6 px-6 space-y-2 text-white/90">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="text-[16px] leading-[1.6] pl-2">{children}</li>
  ),

  // Note component
  note: ({ children }) => (
    <div className="bg-accent/5 border-l-[4px] border-accent text-accent/90 p-[20px] my-[24px] rounded-r-sm font-inter">
      {children}
    </div>
  ),
};

export default MDComponents;
