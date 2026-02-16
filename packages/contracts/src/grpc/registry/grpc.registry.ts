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
} as const;
