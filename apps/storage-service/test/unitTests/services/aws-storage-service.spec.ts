import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Test, TestingModule } from '@nestjs/testing'

import { QueueName } from '@/infrastructure/queue/queue.types'
import { AwsStorageService } from '@/infrastructure/storage/implementations/aws-storage.service'
import { S3_CLIENT } from '@/shared/aws.types'

describe('AwsStorageService', () => {
	let service: AwsStorageService
	let s3Client: S3Client
	let configService: ConfigService

	const mockBucketName = 'test-bucket'

	const mockS3Client = {
		send: jest.fn()
	}

	const mockConfigService = {
		get: jest.fn().mockReturnValue(mockBucketName)
	}

	const mockClientProxy = {
		send: jest.fn(),
		emit: jest.fn()
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AwsStorageService,
				{ provide: S3_CLIENT, useValue: mockS3Client },
				{ provide: ConfigService, useValue: mockConfigService },
				{ provide: QueueName, useValue: mockClientProxy }
			]
		}).compile()

		service = module.get<AwsStorageService>(AwsStorageService)
		s3Client = module.get<S3Client>(S3_CLIENT)
		configService = module.get<ConfigService>(ConfigService)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	it('should upload a file to S3 with correct parameters', async () => {
		const storageData = {
			data: Buffer.from('file content'),
			fileName: 'test-file.txt',
			mimetype: 'text/plain'
		}

		await service.save(storageData)

		expect(configService.get).toHaveBeenCalledWith('aws.bucketName', {
			infer: true
		})
		expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand))

		const commandCall = (s3Client.send as jest.Mock).mock.calls[0][0]
		expect(commandCall.input).toEqual({
			Bucket: mockBucketName,
			Key: storageData.fileName,
			Body: storageData.data,
			ContentType: storageData.mimetype
		})
	})

	it('should delete a file from S3 and return true', async () => {
		const fileName = 'delete-me.png'

		const result = await service.remove(fileName)

		expect(result).toBe(true)
		expect(s3Client.send).toHaveBeenCalledWith(
			expect.any(DeleteObjectCommand)
		)

		// Verify the command payload
		const commandCall = (s3Client.send as jest.Mock).mock.calls[0][0]
		expect(commandCall.input).toEqual({
			Bucket: mockBucketName,
			Key: fileName
		})
	})
})
