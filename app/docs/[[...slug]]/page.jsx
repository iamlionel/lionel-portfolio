import { getFileList } from "@/utils/getFileList";
import React from "react";
import fs from "fs/promises";
import yaml, { Schema } from "js-yaml";
import DocsNav from "@/components/blog/DocsNav";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import path from "path";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import DocumentNav from "@/components/blog/DocumentNav";

const MATTER_OPTIONTS = {
  engines: {
    yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
  },
};

export async function generateStaticParams() {
  const paths = getFileList("docs");
  const params = paths.map((path) => {
    slug: path.split("/").slice(2);
  });
  return params;
}

async function getNavLinks() {
  const data = await fs.readFile("data/documentation-links.yaml", "utf-8");
  const parsedData = yaml.load(data, { schema: yaml.JSON_SCHEMA });
  // console.log(JSON.stringify(parsedData, null, 2));
  return Array.isArray(parsedData) ? parsedData : [];
}

async function getDocContent(slug) {
  const filePath = path.join(process.cwd(), "docs", ...slug);
  let file;

  try {
    file = await fs.readFile(`${filePath}/index.md`, "utf-8");
  } catch (error) {
    file = await fs.readFile(`${filePath}.md`, "utf-8");
  }

  const { data: frontmatter, content } = matter(file, MATTER_OPTIONTS);
  const lastModified = "";
  return {
    frontmatter,
    content,
    lastModified: "",
  };
}

export default async function DocPage({ params }) {
  const { slug = [] } = params;
  const { frontmatter, content, lastModified } = await getDocContent(slug);

  const navLinks = await getNavLinks();
  return (
    <>
      <main className="container mx-auto">
        <div className="grid gap-4 lg:gap-8 grid-cols-1 lg:grid-cols-[310px_1fr]">
          <div>
            <DocsNav navLinks={navLinks} />
          </div>

          <div className="w-full">
            <div className="mb-6">
              <Breadcrumbs />
              <h1 className="text-4xl mt-2 font-bold">{frontmatter.title}</h1>
              <span className="mt-0 text-sm text-gray-600">Last edited on</span>
            </div>

            <div className="grid gap-4 lg:gap-4 grid-cols-1 xl:grid-cols-[1fr_260px]">
              <div className="max-w-[768px] w-full overflow-auto">
                <div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="hidden lg:block">
                <DocumentNav content={content} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
