import axios from "axios";
import { useEffect, useState } from "react";
import usePosts from "../hooks/usePosts";

const PostList = () => {
  const [id, setId] = useState<number>();
  const { data: posts, error, isLoading } = usePosts(id);
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
    </>
  );
};

export default PostList;
