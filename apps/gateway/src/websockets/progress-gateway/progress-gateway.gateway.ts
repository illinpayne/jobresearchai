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
import { JobStatusCacheValue } from '@/shared/job-status.cache'
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
		const { jobId, accountEmail } = data

		const jobCacheValue = await this.redisService.get(
			`${jobNameCacheKey}:${jobId}`
		)

		const jobCacheParsedValue = jobCacheValue
			? (JSON.parse(jobCacheValue) as JobStatusCacheValue)
			: null

		if (
			!jobCacheParsedValue ||
			jobCacheParsedValue.email !== accountEmail
		) {
			client.emit('error', { message: 'Malformed access' })
			client.disconnect()
			return
		}

		await client.join(jobId)

		client.emit('roomJoined', {
			lastMessage: jobCacheParsedValue.lastMessage ?? 'Reasoning resume',
			jobId,
			status: jobCacheParsedValue.status
		} as AiProgressExchangeEventType)
	}

	public broadcastProgress(data: AiProgressExchangeEventType) {
		this.server.to(data.jobId).emit('progressUpdate', data)
	}
}
