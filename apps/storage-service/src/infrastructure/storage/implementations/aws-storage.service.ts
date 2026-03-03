import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'

import { Storage } from '@/common/storage-service.abstract'
import { AllConfigs } from '@/config/interfaces'
import { QueueName } from '@/infrastructure/queue/queue.types'
import { S3_CLIENT, StorageData } from '@/shared/aws.types'

//TODO: Log this service with observability
@Injectable()
export class AwsStorageService implements Storage {
	constructor(
		@Inject(S3_CLIENT) private readonly s3Client: S3Client,
		@Inject(QueueName) private readonly client: ClientProxy,
		private configService: ConfigService<AllConfigs>
	) {}

	public async save(data: StorageData): Promise<void> {
		const { data: body, fileName, mimetype } = data
		const bucketName = this.configService.get('aws.bucketName', {
			infer: true
		})

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: fileName,
			Body: body,
			ContentType: mimetype
		})

		await this.s3Client.send(command)
	}

	public async remove(fileName: string): Promise<boolean> {
		const bucketName = this.configService.get('aws.bucketName', {
			infer: true
		})

		const command = new DeleteObjectCommand({
			Bucket: bucketName,
			Key: fileName
		})

		await this.s3Client.send(command)
		return true
	}
}
