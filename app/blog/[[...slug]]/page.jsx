import { getFileList } from "@/utils/getFileList";
import fs from "fs";
import matter from "gray-matter";
import yaml from "js-yaml";
import path from "path";

const MATTER_OPTIONTS = {
  engines: {
    yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
  },
};

export async function generateStaticParams() {
  const paths = getFileList("blog/en");
  const params = paths
    .filter((p) => p !== "/blog") // root index is handled by empty slug
    .map((p) => ({
      slug: p.replace("/blog/", "").split("/"),
    }));
  // Include the root /blog page (empty slug)
  params.push({ slug: [] });
  return params;
}

async function getDocContent(slug) {
  const getFile = async (lang) => {
    const filePath = path.join(process.cwd(), "blog", lang, ...slug);
    try {
      const content = await fs.promises.readFile(
        `${filePath}/index.md`,
        "utf-8"
      );
      return matter(content, MATTER_OPTIONTS);
    } catch {
      try {
        const content = await fs.promises.readFile(`${filePath}.md`, "utf-8");
        return matter(content, MATTER_OPTIONTS);
      } catch {
        return { data: {}, content: "" };
      }
    }
  };

  const en = await getFile("en");
  const cn = await getFile("cn");

  return { en, cn };
}

async function getNavLinks() {
  const getLinks = async (lang) => {
    try {
      const data = await fs.promises.readFile(
        `blog/${lang}/documentation-links.yaml`,
        "utf8"
      );
      return yaml.load(data, { schema: yaml.JSON_SCHEMA });
    } catch {
      return [];
    }
  };

  const en = await getLinks("en");
  const cn = await getLinks("cn");

  return { en, cn };
}

import BlogContent from "@/components/BlogContent";

export default async function DocPage({ params }) {
  const { slug = [] } = params;
  const { en, cn } = await getDocContent(slug);
  const navLinks = await getNavLinks();

  return (
    <main className="container mx-auto">
      <BlogContent
        contentEn={en.content}
        contentZh={cn.content}
        frontmatterEn={en.data}
        frontmatterZh={cn.data}
        navLinksEn={navLinks.en}
        navLinksZh={navLinks.cn}
      />
    </main>
  );
}
