import type {
	AvatarResponse,
	RemoveAvatarRequest,
	SaveAvatarRequest
} from '@jrai/contracts/gen/storage'
import { STORAGE_SERVICE_NAME } from '@jrai/contracts/gen/storage'
import { Controller, Inject } from '@nestjs/common'
import { ClientProxy, GrpcMethod } from '@nestjs/microservices'
import { nanoid } from 'nanoid'

import { QueueName } from '@/infrastructure/queue/queue.types'

@Controller()
export class UserController {
	constructor(@Inject(QueueName) private readonly client: ClientProxy) {}

	@GrpcMethod(STORAGE_SERVICE_NAME, 'SaveAvatar')
	public async saveAvatar(
		request: SaveAvatarRequest
	): Promise<AvatarResponse> {
		const fileName = nanoid()
		this.client.emit('upload.avatar', {
			bufferArray: request.data,
			fileName: fileName,
			mimetype: request.mimetype
		})

		return { fileName }
	}

	@GrpcMethod(STORAGE_SERVICE_NAME, 'RemoveAvatar')
	public async removeAvatar(
		request: RemoveAvatarRequest
	): Promise<AvatarResponse> {
		const fileName = nanoid()
		this.client.emit('remove.avatar', {
			fileName: request.fileName
		})

		return { fileName }
	}
}
