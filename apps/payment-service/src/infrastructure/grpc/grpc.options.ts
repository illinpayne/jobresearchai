import { grpcPackages as grpcPacks, protoPaths } from '@jrai/contracts'
import { GrpcOptions } from '@nestjs/microservices'

export const grpcPackages = [grpcPacks.payment_v1]
export const grpcProtoPaths = [protoPaths.PAYMENT]

export const grpcProtoLoader: NonNullable<GrpcOptions['options']['loader']> = {
	keepCase: false,
	longs: String,
	enums: Number,
	defaults: true,
	oneofs: true
}
