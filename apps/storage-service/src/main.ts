import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AllConfigs } from '@/config/interfaces'
import { createGrpcServer } from '@/infrastructure/grpc/grpc.server'
import { createRmqServer } from '@/infrastructure/rmq/rmq.server'

import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const logger = new Logger('StorageMicroservice')
	const config = app.get(ConfigService<AllConfigs>)

	createGrpcServer(app, config)
	createRmqServer(app, config)

	try {
		await app.startAllMicroservices()
		await app.init()

		const mode = config.get('app.node_env', { infer: true })
		logger.log(
			`🚀 Storage microservice successfully configured in ${mode} mode`
		)
	} catch (error) {
		logger.error(
			`❌ Failed to start microservice: ${error.message ?? 'unknown issue'}`,
			error
		)
		process.exit(1)
	}
}

void bootstrap()
