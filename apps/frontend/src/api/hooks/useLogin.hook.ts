import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AuthResponse, LoginDto } from "../generated";
import { login } from "../requests/auth.req";

export const useLogin = (
  options?: Omit<
    UseMutationOptions<AuthResponse, unknown, LoginDto>,
    "mutationKey" | "mutationFn"
  >,
) =>
  useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginDto) => login(data),
    ...options,
  });
