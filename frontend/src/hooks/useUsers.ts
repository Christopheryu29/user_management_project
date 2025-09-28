import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { User, UserFormData, UsersResponse } from "../types/User";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: { page: number; limit: number; search: string }) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook to fetch users with pagination and search
export const useUsers = (
  page: number = 1,
  limit: number = 6,
  search: string = ""
) => {
  return useQuery<UsersResponse>({
    queryKey: userKeys.list({ page, limit, search }),
    queryFn: () => userService.getUsers(page, limit, search),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
  });
};

// Hook to fetch a single user
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id, // Only run query if id exists
  });
};

// Hook to create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserFormData) => userService.createUser(userData),
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Optionally add the new user to the cache
      queryClient.setQueryData(userKeys.detail(newUser._id), newUser);
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
    },
  });
};

// Hook to update a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UserFormData }) =>
      userService.updateUser(id, userData),
    onSuccess: (updatedUser, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);

      // Invalidate users list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });
};

// Hook to delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Remove the user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });

      // Invalidate users list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
    },
  });
};
