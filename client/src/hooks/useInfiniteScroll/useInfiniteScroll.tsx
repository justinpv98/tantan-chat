import { MutableRefObject, useEffect, useRef, useState } from "react";

function useInfiniteScroll(containerRef: MutableRefObject<any>) {
  const [canLoadMore, setCanLoadMore] = useState(false);
  const loadMoreRef = useRef(null);


  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setCanLoadMore(true);
      } else {
        setCanLoadMore(false);
      }
    }, {root: containerRef.current, rootMargin: '400px'});

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [loadMoreRef, canLoadMore]);

  return { loadMoreRef, canLoadMore };
}

export default useInfiniteScroll;
