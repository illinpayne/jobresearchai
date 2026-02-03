import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createGrpcServer } from './infrastructure/grpc/grpc.server'
import { ConfigService } from '@nestjs/config'
import { AllConfigs } from './config/interfaces'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('AuthMicroservice');
  const config = app.get(ConfigService<AllConfigs>);
  
  createGrpcServer(app, config)

  try {
    
    await app.startAllMicroservices();
    await app.init();
    logger.log('🚀 Auth microservice successfully configured')
  } catch (error) {
    logger.error(
      `❌ Failed to start microservice: ${error.message ?? 'unknows issue'}`,
      error,
    );
    process.exit(1);
  }
}
void bootstrap();
