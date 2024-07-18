import axios from "axios";
import { useEffect, useState } from "react";
import usePosts from "../hooks/usePosts";
import React from "react";

const PostList = () => {
  const [id, setId] = useState<number>();
  const pageSize = 10;
  const { data, error, isLoading, fetchNextPage, isFetchingNextPage } =
    usePosts({ pageSize });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <>
      <select
        className="form-select"
        aria-label="Default select example"
        onChange={(event) => setId(parseInt(event.target.value))}
        value={id}
      >
        <option value=""></option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </select>
      <ul className="list-group">
        {data.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page?.map((post) => (
              <li key={post.title} className="list-group-item">
                {post.title}
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn-primary ms-2"
        onClick={() => fetchNextPage()}
      >
        {isFetchingNextPage ? "Loading" : "Load More"}
      </button>
    </>
  );
};

export default PostList;
