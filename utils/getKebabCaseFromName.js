export const getKebabCaseFromName = (name) => {
  return name
    .replace(/[#]/g, '')
    .trim()
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '');
};
