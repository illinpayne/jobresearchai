import { grpcPackages as grpcPacks, protoPaths } from '@jrai/contracts'
import { GrpcOptions } from '@nestjs/microservices'

export const grpcPackages = [grpcPacks.aicore_v1]
export const grpcProtoPaths = [protoPaths.AICORE]

export const grpcProtoLoader: NonNullable<GrpcOptions['options']['loader']> = {
	keepCase: false,
	longs: String,
	enums: Number,
	defaults: true,
	oneofs: true
}
