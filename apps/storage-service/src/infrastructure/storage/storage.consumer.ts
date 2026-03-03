import { Controller, Logger } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'

import { Storage } from '@/common/storage-service.abstract'
import { StorageFileType, type StorageQueueData } from '@/shared/aws.types'

import { RmqService } from '../rmq/rmq.service'

@Controller()
export class StorageConsumer {
	private readonly logger = new Logger(StorageConsumer.name)
	public constructor(
		private readonly service: Storage,
		private readonly rmqService: RmqService
	) {}

	@EventPattern('upload.avatar')
	public async uploadAvatar(
		@Payload() data: StorageQueueData,
		@Ctx() ctx: RmqContext
	) {
		try {
			const { bufferArray, fileName, mimetype } = data
			const fileBuffer = Buffer.from(bufferArray)

			const key = `${StorageFileType.Avatar}/${fileName}`

			await this.service.save({
				data: fileBuffer,
				fileName: key,
				mimetype: mimetype
			})
			this.rmqService.ack(ctx)
		} catch (error) {
			this.logger.error('Failed to process background S3 upload', error)
			this.rmqService.nack(ctx)
		}
	}

	@EventPattern('remove.avatar')
	public async removeAvatar(
		@Payload() data: StorageQueueData,
		@Ctx() ctx: RmqContext
	) {
		try {
			const { fileName } = data

			const key = `${StorageFileType.Avatar}/${fileName}`

			await this.service.remove(key)
			this.rmqService.ack(ctx)
		} catch (error) {
			this.logger.error('Failed to process background S3 remove', error)
			this.rmqService.nack(ctx)
		}
	}
}
