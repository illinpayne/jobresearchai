import type {
  BundlesResponse,
  BuyBundleDto,
  CreateSubscription,
  PaymentLinkResponse,
  PlansResponse,
  SubscriptionModelResponse,
} from "../generated";
import { api, instance } from "../instance";

export enum BillingEndpoints {
  PLANS = "/billing/plans",
  BUNDLES = "/billing/bundles",
  SUBSCRIPTION = "/billing/subscription",
  SUBSCRIBE = "/billing/subscribe",
  BUYBUNDLE = "/billing/buy-bundle",
}

export const getPlans = async () => {
  return await api
    .get<PlansResponse>(BillingEndpoints.PLANS)
    .then((response) => response.data);
};

export const getBundles = async () => {
  return await api
    .get<BundlesResponse>(BillingEndpoints.BUNDLES)
    .then((response) => response.data);
};

export const getSubscription = async () => {
  return await instance
    .get<SubscriptionModelResponse>(BillingEndpoints.SUBSCRIPTION)
    .then((response) => response.data);
};

export const subscribeToPlan = async (dto: CreateSubscription) => {
  return await instance
    .post<PaymentLinkResponse>(BillingEndpoints.SUBSCRIBE, dto)
    .then((response) => response.data);
};

export const buyBundle = async (dto: BuyBundleDto) => {
  return await instance
    .post<PaymentLinkResponse>(BillingEndpoints.BUYBUNDLE, dto)
    .then((response) => response.data);
};
