import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'

export function expectFailedPrecondition(error: any, message: string) {
	expect(error).toBeInstanceOf(GrpcException)
	expect(error.error.details).toBe(message)
	expect(error.error.code).toBe(RpcStatus.FAILED_PRECONDITION)
}
