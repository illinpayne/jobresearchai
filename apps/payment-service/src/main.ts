import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AllConfigs } from '@/config/interfaces'
import { createGrpcServer } from '@/infrastructure/grpc/grpc.server'

import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { rawBody: true })
	const logger = new Logger('PaymentMicroservice')
	const config = app.get(ConfigService<AllConfigs>)

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

	createGrpcServer(app, config)

	try {
		await app.startAllMicroservices()
		await app.listen(5001)

		const mode = config.get('app.node_env', { infer: true })
		logger.log(
			`🚀 Payment microservice successfully configured in ${mode} mode`
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
