"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import DocumentNav from "@/components/DocumentNav";
import MDComponents from "@/components/MDComponents";
import { useTranslation } from "@/context/LanguageContext";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import DocsNav from "@/components/DocsNav";
import { getParsedDate } from "@/utils/getParsedDate";

export default function BlogContent({
  contentEn,
  contentZh,
  frontmatterEn,
  frontmatterZh,
  navLinksEn,
  navLinksZh,
}) {
  const { locale, t } = useTranslation();
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
        <div className="flex flex-col mb-12">
          <Breadcrumbs />
          <h1 className="mt-4 mb-0 text-4xl font-bold">{frontmatter.title}</h1>
          {frontmatter.date && (
            <span className="mt-2 text-sm text-white/60">
              {t("blog.lastEdited")}{" "}
              {getParsedDate(frontmatter.date, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
        </div>
        <div className="grid gap-4 lg:gap-8 grid-cols-1 xl:grid-cols-[1fr_260px]">
          <div className="max-w-[768px] w-full">
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
