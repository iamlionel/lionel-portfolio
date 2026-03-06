import fs from "fs";

export const getFileList = (dirName) => {
  let files = [];
  const items = fs.readdirSync(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...getFileList(`${dirName}/${item.name}`)];
    } else if (item.name.endsWith(".md")) {
      files.push(`/${dirName}/${item.name}`);
    }
  }

  return files
    .map((file) => file.replace(".md", ""))
    .map((file) => file.replace("/index", ""))
    .map((file) => file.replace("/blog/en", "/blog")); // Normalize to /blog
};
