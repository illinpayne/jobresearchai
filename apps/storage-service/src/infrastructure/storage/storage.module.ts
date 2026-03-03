import { S3Client } from '@aws-sdk/client-s3'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Storage } from '@/common/storage-service.abstract'
import { AllConfigs } from '@/config/interfaces'
import { getS3Config } from '@/config/loaders/aws-s3.loader'
import { S3_CLIENT } from '@/shared/aws.types'

import { AwsStorageService } from './implementations/aws-storage.service'
import { StorageConsumer } from './storage.consumer'

@Module({
	providers: [
		{
			provide: S3_CLIENT,
			inject: [ConfigService],
			useFactory: (configService: ConfigService<AllConfigs>) => {
				return new S3Client(getS3Config(configService))
			}
		},
		{
			provide: Storage,
			useClass: AwsStorageService
		}
	],
	controllers: [StorageConsumer],
	exports: [Storage]
})
export class StorageModule {}
