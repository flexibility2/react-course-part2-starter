import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}
interface PostQuery {
  pageSize: number;
}
const usePosts = (postQuery: PostQuery) => {
  const fetchPosts = (pageParam: number) =>
    axios
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
        params: {
          _start: (pageParam - 1) * postQuery.pageSize,
          _limit: postQuery.pageSize,
        },
      })
      .then((res) => res.data);

  return useInfiniteQuery<Post[], Error>({
    queryKey: ["uses", postQuery],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    staleTime: 60 * 1000,
    keepPreviousData: true,
    getNextPageParam: (lastpage, allPages) => {
      if (lastpage.length > 0) {
        return allPages.length + 1;
      } else {
        return undefined;
      }
    },
  });
};

export default usePosts;
