import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";
import axios from "axios";

interface AddTodoContext {
  previousTodos: Todo[];
}

const TodoForm = () => {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);

  const addMutate = useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: (todo: Todo) =>
      axios
        .post<Todo[]>("https://jsonplaceholder.typicode.com/todos", todo)
        .then((res) => res.data),

    onMutate: (newTodo: Todo) => {
      queryClient.cancelQueries(["todos"]);
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"] || []);
      queryClient.setQueryData<Todo[]>(["todos"], (old) => [
        newTodo,
        ...(old || []),
      ]);
      return { previousTodos };
    },

    onSuccess: (saveTodo, newTodo) => {
      console.log("saveTodo: ", saveTodo);
      console.log("newTodo: ", newTodo);
      // queryClient.invalidateQueries({
      //   queryKey: ["todos"],
      // });
      queryClient.setQueryData<Todo[]>(["todos"], (todos) =>
        todos?.map((todo) => (todo.id === saveTodo.id ? saveTodo : todo))
      );

      if (ref.current) {
        ref.current.value = "";
      }
    },

    onError: (error, newTodo, context) => {
      if (!context) return;
      queryClient.setQueryData<Todo[]>(["todos"], context?.previousTodos);
    },
  });
  return (
    <>
      {addMutate.error && (
        <div className="alert alert-danger"> {addMutate.error.message}</div>
      )}
      <form
        className="row mb-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (ref.current && ref.current.value) {
            addMutate.mutate({
              id: 0,
              title: ref.current.value,
              userId: 1,
              completed: false,
            });
          }
        }}
      >
        <div className="col">
          <input ref={ref} type="text" className="form-control" />
        </div>
        <div className="col">
          <button className="btn btn-primary" disabled={addMutate.isLoading}>
            {addMutate.isLoading ? "Adding" : "Add"}
          </button>
        </div>
      </form>
    </>
  );
};

export default TodoForm;
