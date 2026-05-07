import {
	type AiJoinRoomEventType,
	type AiProgressExchangeEventType,
	EventStatusCode
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

	@SubscribeMessage('listenResumeJob')
	public async handleJoinRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: AiJoinRoomEventType
	): Promise<AiProgressExchangeEventType> {
		const { jobId, accountEmail } = data

		const jobData = await this.validateJobAccess(jobId, accountEmail)
		if (!jobData) {
			setTimeout(() => client.disconnect(), 100)
			return {
				lastMessage: 'Malformed request',
				jobId,
				status: EventStatusCode.CANCELLED
			}
		}

		await client.join(jobId)

		return {
			lastMessage: jobData.lastMessage ?? 'Reasoning resume',
			jobId,
			status: jobData.status
		}
	}

	public broadcastProgress(data: AiProgressExchangeEventType) {
		this.server.to(data.jobId).emit('updateResumeJob', data)
	}

	private async validateJobAccess(jobId: string, email: string) {
		const cache = await this.redisService.get(`${jobNameCacheKey}:${jobId}`)
		if (!cache) return null

		const parsed = JSON.parse(cache) as JobStatusCacheValue
		if (parsed.email !== email) {
			return null
		}

		return parsed
	}
}
