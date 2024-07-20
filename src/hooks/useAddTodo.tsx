import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";
import axios from "axios";
import { CACHE_KEY_TODOS } from "../constant";

interface AddTodoContext {
  previousTodos: Todo[];
}

const useAddTodo = (onAdd: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: (todo: Todo) =>
      axios
        .post<Todo[]>("https://jsonplaceholder.typicode.com/todos", todo)
        .then((res) => res.data),

    onMutate: (newTodo: Todo) => {
      queryClient.cancelQueries(CACHE_KEY_TODOS);
      const previousTodos = queryClient.getQueryData<Todo[]>(
        CACHE_KEY_TODOS || []
      );
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (old = []) => [
        newTodo,
        ...old,
      ]);
      return { previousTodos };
    },

    onSuccess: (saveTodo: Todo, newTodo: Todo) => {
      console.log("saveTodo: ", saveTodo);
      console.log("newTodo: ", newTodo);
      // queryClient.invalidateQueries({
      //   queryKey: CACHE_KEY_TODOS,
      // });
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) =>
        todos?.map((todo) => (todo.id === saveTodo.id ? saveTodo : todo))
      );

      onAdd();
    },

    onError: (_error: Error, _newTodo: Todo, context: AddTodoContext) => {
      if (!context) return;
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, context?.previousTodos);
    },
  });
};

export default useAddTodo;
