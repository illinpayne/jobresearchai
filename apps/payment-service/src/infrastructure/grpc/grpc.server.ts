import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AllConfigs } from '@/config/interfaces'

import { grpcPackages, grpcProtoLoader, grpcProtoPaths } from './grpc.options'

export function createGrpcServer(
	app: INestApplication,
	config: ConfigService<AllConfigs>
) {
	const host = config.get('app.host', { infer: true })
	const port = config.get('app.port', { infer: true })
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			package: grpcPackages,
			protoPath: grpcProtoPaths,
			url: `${host}:${port}`,
			loader: grpcProtoLoader
		}
	})
}
