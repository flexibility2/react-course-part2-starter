import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}
interface PostQuery {
  page: number;
  pageSize: number;
}
const usePosts = (postQuery: PostQuery) => {
  const fetchPosts = () =>
    axios
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
        params: {
          _start: (postQuery.page - 1) * postQuery.pageSize,
          _limit: postQuery.pageSize,
        },
      })
      .then((res) => res.data);

  return useQuery<Post[], Error>({
    queryKey: ["uses", postQuery],
    queryFn: fetchPosts,
    staleTime: 60 * 1000,
    keepPreviousData: true,
  });
};

export default usePosts;
