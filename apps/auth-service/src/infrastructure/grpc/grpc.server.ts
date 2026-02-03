import { INestApplication } from '@nestjs/common'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'

import { grpcPackages, grpcProtoPaths } from './grpc.options'
import { ConfigService } from '@nestjs/config'
import { AllConfigs } from '@/config/interfaces'

export function createGrpcServer(app: INestApplication, config: ConfigService<AllConfigs>) {
	const host = config.get('app.host', {infer: true})
	const port = config.get('app.port', {infer: true})
	
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			package: grpcPackages,
			protoPath: grpcProtoPaths,
			url: `${host}:${port}`,
			loader: {
				keepCase: false,
				longs: String,
				enums: String,
				defaults: true,
				oneofs: true
			}
		}
	})
}
