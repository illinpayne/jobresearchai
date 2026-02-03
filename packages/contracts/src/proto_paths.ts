import { join } from "path";

export const protoPaths = {
  AUTH: join(__dirname, "../../proto/auth.proto"),
} as const;

export const grpcPackages = {
  auth_v1: "auth.v1",
} as const;
