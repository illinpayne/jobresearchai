import { HttpStatus } from "@nestjs/common";
import { RpcStatus } from "../enums/rpc-status.enum";

export const grpcToHttpStatus: Record<number, number> = {
  [RpcStatus.OK]: HttpStatus.OK,
  [RpcStatus.CANCELLED]: 499,
  [RpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
  [RpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
  [RpcStatus.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
  [RpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [RpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [RpcStatus.PERMISSION_DENINED]: HttpStatus.FORBIDDEN,
  [RpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
  [RpcStatus.FAILED_PRECONDITION]: HttpStatus.BAD_GATEWAY,
  [RpcStatus.ABORTED]: HttpStatus.CONFLICT,
  [RpcStatus.OUF_OF_RANGE]: HttpStatus.BAD_GATEWAY,
  [RpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
  [RpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  [RpcStatus.UNAVAILABLE]: HttpStatus.INTERNAL_SERVER_ERROR,
  [RpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  [RpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};
