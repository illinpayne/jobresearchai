import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { CreateSubscription, PaymentLinkResponse } from "../generated";
import { subscribeToPlan } from "../requests/billing.req";

export const useSubscribe = (
  options?: Omit<
    UseMutationOptions<PaymentLinkResponse, unknown, CreateSubscription>,
    "mutationKey" | "mutationFn"
  >,
) =>
  useMutation({
    mutationKey: ["subscribe"],
    mutationFn: (data: CreateSubscription) => subscribeToPlan(data),
    ...options,
  });
