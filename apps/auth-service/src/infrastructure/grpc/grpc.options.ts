import { grpcPackages as grpcPacks, protoPaths } from '@jrai/contracts'
import { GrpcOptions } from '@nestjs/microservices'

export const grpcPackages = [grpcPacks.auth_v1]
export const grpcProtoPaths = [protoPaths.AUTH]

export const grpcProtoLoader: NonNullable<GrpcOptions['options']['loader']> = {
	keepCase: false,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
}
