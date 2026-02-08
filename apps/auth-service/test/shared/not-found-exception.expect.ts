import { RpcStatus } from '@jrai/contracts/grpc'
import { RpcException } from '@nestjs/microservices'

export function expectNotFound(error: any, message: string) {
	expect(error).toBeInstanceOf(RpcException)
	expect(error.error.details).toBe(message)
	expect(error.error.code).toBe(RpcStatus.NOT_FOUND)
}
