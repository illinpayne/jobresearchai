import { join } from "path";

export const protoPaths = {
  AUTH: join(__dirname, "../../proto/auth.proto"),
  ACCOUNT: join(__dirname, "../../proto/account.proto"),
  STORAGE: join(__dirname, "../../proto/storage.proto"),
} as const;

export const grpcPackages = {
  auth_v1: "auth.v1",
  account_v1: "account.v1",
  storage_v1: "storage.v1",
} as const;
