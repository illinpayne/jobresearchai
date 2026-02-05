import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'

import { GrpcExceptionFilter } from '@/common/filters'
import { getCorsConfig, getValidationPipeConfig } from '@/config/loaders'

import { AppModule } from './app.module'
import { AllConfigs, AppConfig } from './config/interfaces'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const logger = new Logger(AppModule.name)

	const config = app.get(ConfigService<AllConfigs>)
	const app_environments: AppConfig = config.get('app', {
		infer: true
	}) as AppConfig

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: '1'
	})

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Job Research AI')
		.setDescription('Find job faster with Job Research AI')
		.setVersion('1.0.0')
		.addBearerAuth()
		.build()

	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('/docs', app, document, {
		yamlDocumentUrl: 'swagger.yaml'
	})

	app.useGlobalFilters(new GrpcExceptionFilter())

	app.use(cookieParser(app_environments.cookie_secret))
	app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()))
	app.enableCors(getCorsConfig(config))

	try {
		await app.listen(app_environments.port ?? 5000)
		logger.log(
			`🚀 Server is running at: ${app_environments.host}:${app_environments.port}`
		)
		logger.log(`🚀 Server is working in ${app_environments.node_env} mode`)
	} catch (error) {
		logger.error(
			`❌ Failed to start server: ${error.message ?? 'unknows issue'}`,
			error
		)
		process.exit(1)
	}
}

void bootstrap()
