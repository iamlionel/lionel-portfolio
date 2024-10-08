import { getFileList } from '@/utils/getFileList';
import React from 'react';
import fs from 'fs/promises';
import yaml, { Schema } from 'js-yaml';
import DocsNav from '@/components/blog/DocsNav';

export async function generateStaticParams() {
  const paths = getFileList('docs');
  const params = paths.map((path) => {
    slug: path.split('/').slice(2);
  });
  return params;
}

async function getNavLinks() {
  const data = await fs.readFile('data/documentation-links.yaml', 'utf-8');
  const parsedData = yaml.load(data, { schema: yaml.JSON_SCHEMA });
  // console.log(JSON.stringify(parsedData, null, 2));
  return Array.isArray(parsedData) ? parsedData : [];
}

export default async function DocPage({ params }) {
  const { slug = [] } = params;
  const navLinks = await getNavLinks();
  return (
    <>
      <main className="container mx-auto">
        <div className="grid gap-4 lg:gap-8 grid-cols-1 lg:grid-cols-[310px_1fr]">
          <div>
            <DocsNav navLinks={navLinks} />
          </div>

          <div>
            <div>
              <div>header</div>
            </div>

            <div>
              <div className="flex flex-cols">
                <div>content-</div>
                <div>documentNav</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
