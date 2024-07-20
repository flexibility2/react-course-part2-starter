import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";
import axios from "axios";
import { CACHE_KEY_TODOS } from "../constant";
import todoService from "../services/todoService";

interface AddTodoContext {
  previousTodos: Todo[];
}

const useAddTodo = (onAdd: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: todoService.post,
    onMutate: (newTodo: Todo) => {
      queryClient.cancelQueries(CACHE_KEY_TODOS);
      const previousTodos = queryClient.getQueryData<Todo[]>(
        CACHE_KEY_TODOS || []
      );
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (old = []) => [
        newTodo,
        ...old,
      ]);
      onAdd();

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
    },

    onError: (_error: Error, _newTodo: Todo, context: AddTodoContext) => {
      if (!context) return;
      queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, context?.previousTodos);
    },
  });
};

export default useAddTodo;
