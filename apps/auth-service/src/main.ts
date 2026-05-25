import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { AllConfigs } from './config/interfaces'
import { createGrpcServer } from './infrastructure/grpc/grpc.server'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const logger = new Logger('AuthMicroservice')
	const config = app.get(ConfigService<AllConfigs>)

	createGrpcServer(app, config)

	try {
		await app.startAllMicroservices()
		await app.init()

		const mode = config.get('app.node_env', { infer: true })
		logger.log(
			`🚀 Auth microservice successfully configured in ${mode} mode`
		)
	} catch (error) {
		logger.error(
			`❌ Failed to start microservice: ${error.message ?? 'unknows issue'}`,
			error
		)
		process.exit(1)
	}
}
void bootstrap()
