import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { AllConfigs } from './config/interfaces'
import { createRmqServer } from './infrastructure/rmq/rmq.server'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const logger = new Logger('NotificationMicroservice')
	const config = app.get(ConfigService<AllConfigs>)

	createRmqServer(app, config)

	try {
		await app.startAllMicroservices()
		await app.init()
		logger.log('🚀 Notification microservice successfully configured')
	} catch (error) {
		logger.error(
			`❌ Failed to start microservice: ${error.message ?? 'unknown issue'}`,
			error
		)
		process.exit(1)
	}
}

void bootstrap()
