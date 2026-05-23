import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { BuyBundleDto, PaymentLinkResponse } from "../generated";
import { buyBundle } from "../requests/billing.req";

export const useBuyBundle = (
  options?: Omit<
    UseMutationOptions<PaymentLinkResponse, unknown, BuyBundleDto>,
    "mutationKey" | "mutationFn"
  >,
) =>
  useMutation({
    mutationKey: ["buy-bundle"],
    mutationFn: (data: BuyBundleDto) => buyBundle(data),
    ...options,
  });
