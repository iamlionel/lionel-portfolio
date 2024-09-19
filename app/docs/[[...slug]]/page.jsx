import { getFileList } from '@/utils/getFileList';
import React from 'react';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getParsedDate } from '@/utils/getParsedDate';
import { getLastModifiedDate } from '@/utils/getLastModifiedDate';
import ReactMarkdown from 'react-markdown';

const MATTER_OPTIONTS = {
  engines: {
    yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
  },
};

export async function generateStaticParams() {
  const paths = getFileList('docs');
  return paths.map((path) => {
    slug: path.split('/').slice(1);
  });
}

async function getDocContent(slug) {
  const filePath = path.join(process.cwd(), 'docs', ...slug);
  let file;

  try {
    file = await fs.promises.readFile(`${filePath}/index.md`, 'utf-8');
  } catch (error) {
    file = await fs.promises.readFile(`${filePath}.md`, 'utf-8');
  }

  const { data: frontmatter, content } = matter(file, MATTER_OPTIONTS);
  const lastModified = await getLastModifiedDate(filePath);

  console.log(lastModified);
  return {
    frontmatter,
    content,
    lastModified: getParsedDate(lastModified, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  };
}

export default async function DocPage({ params }) {
  const { slug = [] } = params;
  const { frontmatter, content, lastModified } = await getDocContent(slug);
  console.log(frontmatter, lastModified);
  return (
    <div>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
