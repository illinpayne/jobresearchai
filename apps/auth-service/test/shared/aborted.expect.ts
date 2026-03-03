import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'

export function expectAborted(error: any, message: string) {
	expect(error).toBeInstanceOf(GrpcException)
	expect(error.error.details).toBe(message)
	expect(error.error.code).toBe(RpcStatus.ABORTED)
}
