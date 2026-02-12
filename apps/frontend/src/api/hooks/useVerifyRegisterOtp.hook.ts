import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AuthResponse, VerifyOTPRegister } from "../generated";
import { verifyRegisterOtp } from "../requests/auth.req";

export const useVerifyRegisterOtp = (
  options?: Omit<
    UseMutationOptions<AuthResponse, unknown, VerifyOTPRegister>,
    "mutationKey" | "mutationFn"
  >,
) =>
  useMutation({
    mutationKey: ["verify-register-otp"],
    mutationFn: (data: VerifyOTPRegister) => verifyRegisterOtp(data),
    ...options,
  });
