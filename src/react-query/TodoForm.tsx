import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";
import axios from "axios";

const TodoForm = () => {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);

  const addMutate = useMutation<Todo, Error, Todo>({
    mutationFn: (todo: Todo) =>
      axios
        .post<Todo[]>("https://jsonplaceholder.typicode.com/todos", todo)
        .then((res) => res.data),
    onSuccess: (saveTodo, newTodo) => {
      console.log("saveTodo: ", saveTodo);
      console.log("newTodo: ", newTodo);
      // queryClient.invalidateQueries({
      //   queryKey: ["todos"],
      // });
      queryClient.setQueryData<Todo[]>(["todos"], (todos) => [
        saveTodo,
        ...(todos || []),
      ]);

      if (ref.current) {
        ref.current.value = "";
      }
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
