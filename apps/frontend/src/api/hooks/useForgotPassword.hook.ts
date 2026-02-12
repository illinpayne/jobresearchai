import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { ForgotPasswordDto, SendOtpResponse } from "../generated";
import { forgotPassword } from "../requests/auth.req";

export const useForgotPassword = (
  options?: Omit<
    UseMutationOptions<SendOtpResponse, unknown, ForgotPasswordDto>,
    "mutationKey" | "mutationFn"
  >,
) =>
  useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (data: ForgotPasswordDto) => forgotPassword(data),
    ...options,
  });
