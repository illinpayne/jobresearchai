import { protoPaths } from "../../proto_paths";

export const GRPC_CLIENT = {
  AUTH_PACKAGE: {
    package: "auth.v1",
    protoPath: protoPaths.AUTH,
    env: "AUTH_GRPC_URL",
  },
  ACCOUNT_PACKAGE: {
    package: "account.v1",
    protoPath: protoPaths.ACCOUNT,
    env: "ACCOUNT_GRPC_URL",
  },
  STORAGE_PACKAGE: {
    package: "storage.v1",
    protoPath: protoPaths.STORAGE,
    env: "STORAGE_GRPC_URL",
  },
  AICORE_PACKAGE: {
    package: "aicore.v1",
    protoPath: protoPaths.AICORE,
    env: "AICORE_GRPC_URL",
  },
} as const;
