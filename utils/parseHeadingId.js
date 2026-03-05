import { getKebabCaseFromName } from "./getKebabCaseFromName";

export const parseHeadingId = (children) => {
  console.log("PARSE_HEADING_ID INPUT:", JSON.stringify(children));
  const CHECK = "{#";
  const childrenArray = Array.isArray(children) ? children : [children];
  const lastChild = childrenArray[childrenArray.length - 1];

  if (typeof lastChild === "string" && lastChild.includes(CHECK)) {
    const split = lastChild.split(CHECK);
    const headingId = split[split.length - 1].split("}")[0];
    const newChildren = [...childrenArray];
    newChildren[newChildren.length - 1] = split[0];

    const textChildren = Array.isArray(children)
      ? newChildren.map((c) => (typeof c === "string" ? c : "")).join("")
      : split[0];

    return {
      children: Array.isArray(children) ? newChildren : split[0],
      title: textChildren.replaceAll("#", "").trim(),
      headingId,
    };
  }

  const textChildren = Array.isArray(children)
    ? childrenArray.map((c) => (typeof c === "string" ? c : "")).join("")
    : typeof children === "string"
      ? children
      : "";

  return {
    children,
    title: textChildren.replaceAll("#", "").trim(),
    headingId: getKebabCaseFromName(textChildren),
  };
};
