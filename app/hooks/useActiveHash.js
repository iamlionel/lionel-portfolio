import { useState, useEffect } from "react";

export const useActiveHash = (itemIds, rootMargin = "0% 0% -80% 0%") => {
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    console.log("Effect running. ItemIds:", itemIds);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(`Element entering viewport: ${entry.target.id}`);
            setActiveHash(entry.target.id);
          } else {
            console.log(`Element leaving viewport: ${entry.target.id}`);
          }
        });
      },
      { rootMargin }
    );

    itemIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        console.log(`Starting to observe element: ${id}`);
        observer.observe(element);
      } else {
        console.warn(`Element not found: ${id}`);
      }
    });

    return () => {
      console.log("Cleanup function called");
      itemIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          console.log(`Stopping observation of element: ${id}`);
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds, rootMargin]);

  useEffect(() => {
    console.log("Active hash changed:", activeHash);
  }, [activeHash]);

  return activeHash;
};
