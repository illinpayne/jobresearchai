import { join } from "path";

export const protoPaths = {
  AUTH: join(__dirname, "../../proto/auth.proto"),
  ACCOUNT: join(__dirname, "../../proto/account.proto"),
  STORAGE: join(__dirname, "../../proto/storage.proto"),
  AICORE: join(__dirname, "../../proto/aicore.proto"),
  JOB: join(__dirname, "../../proto/job.proto"),
  PAGINATION: join(__dirname, "../../proto/pagination.proto"),
  PAYMENT: join(__dirname, "../../proto/payment.proto"),
} as const;

export const grpcPackages = {
  auth_v1: "auth.v1",
  account_v1: "account.v1",
  storage_v1: "storage.v1",
  aicore_v1: "aicore.v1",
  job_v1: "job.v1",
  pagination_v1: "pagination.v1",
  payment_v1: "payment.v1",
} as const;
