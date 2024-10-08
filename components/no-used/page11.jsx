import { getFileList } from "@/utils/getFileList";
import React from "react";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getParsedDate } from "@/utils/getParsedDate";
import { getLastModifiedDate } from "@/utils/getLastModifiedDate";
import ReactMarkdown from "react-markdown";
import DocumentNav from "@/components/no-used/DocumentNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import MDComponents from "@/components/MDComponents";
import DocsNav from "@/components/no-used/DocsNav";

const MATTER_OPTIONTS = {
  engines: {
    yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
  },
};

export async function generateStaticParams() {
  const paths = getFileList("docs");
  const params = paths.map((path) => ({
    slug: path.split("/").slice(1),
  }));
  console.log(params);
  return params;
}

async function getDocContent(slug) {
  const filePath = path.join(process.cwd(), "docs", ...slug);
  let file;

  try {
    file = await fs.promises.readFile(`${filePath}/index.md`, "utf-8");
  } catch (error) {
    file = await fs.promises.readFile(`${filePath}.md`, "utf-8");
  }

  const { data: frontmatter, content } = matter(file, MATTER_OPTIONTS);
  // const lastModified = await getLastModifiedDate(filePath);
  const lastModified = "";
  return {
    frontmatter,
    content,
    lastModified: getParsedDate(lastModified, {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

async function getNavLinks() {
  const data = await fs.promises.readFile(
    "data/documentation-links.yaml",
    "utf8"
  );
  const parsedData = yaml.load(data, { schema: yaml.JSON_SCHEMA });
  return Array.isArray(parsedData) ? parsedData : [];
}

export default async function DocPage({ params }) {
  const { slug = [] } = params;
  console.log(slug);
  const { frontmatter, content, lastModified } = await getDocContent(slug);
  // console.log(frontmatter, lastModified);
  const navLinks = await getNavLinks();
  return (
    <main className="container mx-auto">
      <div className="grid gap-4 lg:gap-8 grid-cols-1 lg:grid-cols-[310px_1fr]">
        <div className="flex flex-cols">
          <DocsNav navLinks={navLinks} />
        </div>
        <div className="flex flex-col pb-4 w-full" id="main-content">
          <div className="flex flex-col mb-16">
            <Breadcrumbs />
            <h1 className="mt-4 mb-0 text-4xl font-bold">
              {frontmatter.title}
            </h1>
            <span className="mt-0 text-sm text-gray-600">
              Last edited on {lastModified}
            </span>
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
    </main>
  );
}
