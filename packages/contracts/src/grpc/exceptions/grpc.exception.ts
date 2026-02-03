import { RpcException } from "@nestjs/microservices";
import { RpcStatus } from "../enums";

export class GrpcException extends RpcException {
  constructor(code: RpcStatus, message: string) {
    super({ code, details: message });
  }
}
