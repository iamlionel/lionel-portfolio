// Assuming getKebabCaseFromName is imported or defined elsewhere

import { getKebabCaseFromName } from './getKebabCaseFromName';

export function parseHeadingId(children) {
  const CHECK = '{#';
  const lastChild = children[children.length - 1];
  const split = lastChild.split(CHECK);

  if (lastChild.includes(CHECK)) {
    const headingId = split[split.length - 1].split('}')[0];
    const newChildren = [...children];
    newChildren[newChildren.length - 1] = split[0];
    return {
      children: newChildren,
      title: split[0].replace(/#/g, '').trim(),
      headingId,
    };
  }

  return {
    children,
    title: split[0].replace(/#/g, '').trim(),
    headingId: getKebabCaseFromName(split[0]),
  };
}
