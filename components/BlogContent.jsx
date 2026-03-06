"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import DocumentNav from "@/components/DocumentNav";
import MDComponents from "@/components/MDComponents";
import { useTranslation } from "@/context/LanguageContext";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import DocsNav from "@/components/DocsNav";

export default function BlogContent({
  contentEn,
  contentZh,
  frontmatterEn,
  frontmatterZh,
  navLinksEn,
  navLinksZh,
}) {
  const { locale } = useTranslation();
  const isZh = locale === "zh" && frontmatterZh?.title;

  const content = isZh ? contentZh : contentEn;
  const frontmatter = isZh ? frontmatterZh : frontmatterEn;
  const navLinks = locale === "zh" ? navLinksZh : navLinksEn;

  return (
    <div className="grid gap-4 lg:gap-8 grid-cols-1 lg:grid-cols-[310px_1fr]">
      <div className="flex flex-cols">
        <DocsNav navLinks={navLinks} />
      </div>
      <div className="flex flex-col pb-4 w-full" id="main-content">
        <div className="flex flex-col mb-16">
          <Breadcrumbs />
          <h1 className="mt-4 mb-0 text-4xl font-bold">{frontmatter.title}</h1>
        </div>
        <div className="grid gap-4 lg:gap-8 grid-cols-1 xl:grid-cols-[1fr_260px]">
          <div className="max-w-[768px] w-full overflow-auto">
            <div className="[&>*:first-child]:mt-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={MDComponents}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
          <div className="hidden xl:block">
            <DocumentNav content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
