import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { SubscriptionModelResponse } from "../generated";
import { cancelSubscription } from "../requests/billing.req";

export const useCancelSubscription = (
  options?: Omit<
    UseMutationOptions<SubscriptionModelResponse, unknown, void>,
    "mutationKey" | "mutationFn"
  >,
) =>
  useMutation({
    mutationKey: ["cancel-subscription"],
    mutationFn: () => cancelSubscription(),
    ...options,
  });
