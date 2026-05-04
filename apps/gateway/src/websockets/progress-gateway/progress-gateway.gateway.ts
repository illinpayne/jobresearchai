import type {
	AiJoinRoomEventType,
	AiProgressExchangeEventType
} from '@jrai/contracts'
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { RedisService } from '@/infrastructure/redis/redis.service'
import { jobNameCacheKey } from '@/shared/websockets'

@WebSocketGateway({ namespace: '/progress', cors: true })
export class ProgressGateway {
	@WebSocketServer()
	private server: Server

	public constructor(private readonly redisService: RedisService) {}

	@SubscribeMessage('joinJobRoom')
	public async handleJoinRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: AiJoinRoomEventType
	) {
		const { jobId, accountId } = data

		const ownerId = await this.redisService.get(
			`${jobNameCacheKey}:${jobId}`
		)

		if (!ownerId || ownerId !== accountId) {
			client.emit('error', { message: 'Malformed job access' })
			client.disconnect()
			return
		}

		await client.join(jobId)

		client.emit('roomJoined', {
			status: 'Initializing job',
			jobId
		})
	}

	public broadcastProgress(data: AiProgressExchangeEventType) {
		this.server.to(data.jobId).emit('progressUpdate', data.statusMessage)
	}
}
