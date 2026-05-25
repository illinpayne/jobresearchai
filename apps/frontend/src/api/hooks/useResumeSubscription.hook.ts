import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { SubscriptionModelResponse } from "../generated";
import { resumeSubscription } from "../requests/billing.req";

export const useResumeSubscription = (
  options?: Omit<
    UseMutationOptions<SubscriptionModelResponse, unknown, void>,
    "mutationKey" | "mutationFn"
  >,
) =>
  useMutation({
    mutationKey: ["resume-subscription"],
    mutationFn: () => resumeSubscription(),
    ...options,
  });
