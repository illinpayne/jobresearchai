import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { SendOtpRegisterDto, SendOtpResponse } from "../generated";
import { sendRegisterOtp } from "../requests/auth.req";

export const useSendRegisterOtp = (
  options?: Omit<
    UseMutationOptions<SendOtpResponse, unknown, SendOtpRegisterDto>,
    "mutationKey" | "mutationFn"
  >,
) =>
  useMutation({
    mutationKey: ["send-register-otp"],
    mutationFn: (data: SendOtpRegisterDto) => sendRegisterOtp(data),
    ...options,
  });
