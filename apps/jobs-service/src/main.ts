import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AllConfigs } from '@/config/interfaces'
import { createGrpcServer } from '@/infrastructure/grpc/grpc.server'

import { AppModule } from './app.module'
import { createRmqServer } from './infrastructure/rmq/rmq.server'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const logger = new Logger('JobsMicroservice')
	const config = app.get(ConfigService<AllConfigs>)

	createGrpcServer(app, config)
	createRmqServer(app, config)

	try {
		await app.startAllMicroservices()
		await app.init()
		logger.log('🚀 Jobs microservice successfully configured')
	} catch (error) {
		logger.error(
			`❌ Failed to start microservice: ${error.message ?? 'unknows issue'}`,
			error
		)
		process.exit(1)
	}
}
void bootstrap()
