export const checkNavLinks = ({ to, items, pathCheck }) => {
  if (to === pathCheck) {
    return true;
  }

  if (items) {
    return items.some((item) =>
      checkNavLinks({
        to: item.to,
        items: item.items,
        pathCheck,
      })
    );
  }

  return false;
};
