import axios from "axios";
import { useEffect, useState } from "react";
import usePosts from "../hooks/usePosts";

const PostList = () => {
  const [id, setId] = useState<number>();
  const pageSize = 10;
  const [page, setPage] = useState<number>(1);
  const { data: posts, error, isLoading } = usePosts({ page, pageSize });

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
        {posts?.map((post) => (
          <li key={post.title} className="list-group-item">
            {post.title}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Back
      </button>
      <button
        type="button"
        className="btn btn-primary ms-2"
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </>
  );
};

export default PostList;
