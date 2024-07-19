import "./App.css";
import PostList from "./react-query/PostList";
import TodoForm from "./react-query/TodoForm";
import TodoList from "./react-query/TodoList";

function App() {
  // return <TodoList></TodoList>;
  // return <PostList></PostList>;
  return (
    <>
      <TodoForm></TodoForm>
      <TodoList></TodoList>
    </>
  );
}

export default App;
