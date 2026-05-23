import { AiResumeUploadEventType, EventStatusCode } from '@jrai/contracts'
import { AnalyseStatus, ExtendedAiPreset } from '@jrai/contracts/gen/aicore'
import {
	BadGatewayException,
	BadRequestException,
	Body,
	Controller,
	FileTypeValidator,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	MaxFileSizeValidator,
	NotFoundException,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { nanoid } from 'nanoid'

import { CurrentUser, Protected } from '@/common/decorators'
import { ResumeParser } from '@/common/parsers/common/parser.abstract'
import {
	PDF_PARSER,
	WORD_PARSER
} from '@/infrastructure/parser/parser.inject-keys'
import { QueueService } from '@/infrastructure/queue/queue.service'
import { RedisService } from '@/infrastructure/redis/redis.service'
import { JobStatusCacheValue } from '@/shared/job-status.cache'
import { jobNameCacheKey } from '@/shared/websockets'
import { TextCleaner } from '@/utils/text-cleaner.util'

import { AicoreClientGrpc } from '../ai/aicore.grpc'
import { BillingClientGrpc } from '../billing/billing.grpc'

import { AccountProfilesResponse } from './dtos/account-profiles.dto'
import { UploadResumeDto } from './dtos/upload-resume.dto'

@Controller('resume')
export class ResumeController {
	public constructor(
		@Inject(PDF_PARSER) private readonly pdfParser: ResumeParser,
		@Inject(WORD_PARSER) private readonly wordParser: ResumeParser,
		private readonly aiClient: AicoreClientGrpc,
		private readonly billingClient: BillingClientGrpc,
		private readonly queueService: QueueService,
		private readonly redisService: RedisService
	) {}

	@ApiOperation({
		summary: 'Upload resume for analyse',
		description: 'Provides analysed resume to find jobs'
	})
	@ApiOkResponse({
		description: 'Returns metadata about resume',
		type: String
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiInternalServerErrorResponse({
		description: 'Failed to get personal data'
	})
	@ApiBearerAuth()
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary'
				}
			}
		}
	})
	@Protected()
	@UseInterceptors(FileInterceptor('resume'))
	@Post('upload')
	@HttpCode(HttpStatus.CREATED)
	public async uploadResume(
		@CurrentUser('id') accountId: string,
		@CurrentUser('email') email: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({
						fileType:
							'.(pdf|vnd.openxmlformats-officedocument.wordprocessingml.document)$'
					}),
					new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 })
				]
			})
		)
		file: Express.Multer.File,
		@Body() dto: UploadResumeDto
	) {
		if (!file) {
			throw new NotFoundException('Resume file not found')
		}
		if (!file.mimetype) {
			throw new BadGatewayException('Resume file is broken')
		}

		try {
			const subscription = await this.billingClient.call(
				'getSubscription',
				{
					accountId: accountId
				}
			)

			const extendedPreset: ExtendedAiPreset = await this.aiClient.call(
				'getExtendedPresetByAccount',
				{
					presetId: dto.presetId,
					accountId
				}
			)

			if (!extendedPreset.preset || !extendedPreset.aiExternalModel) {
				throw new BadRequestException(
					'Invalid preset or LLM configuration'
				)
			}

			if (
				Number(subscription.credits) <
				extendedPreset.preset.usageCredits
			) {
				throw new BadRequestException(
					'Insufficient credits, upgrade the new tier or buy extra credits to continue.'
				)
			}

			const jobId = nanoid()
			let extractedText = ''
			if (file.mimetype.includes('pdf')) {
				const text = await this.pdfParser.parse(file.buffer)
				extractedText = TextCleaner.sanitize(text)
			} else {
				extractedText = await this.wordParser.parse(file.buffer)
			}

			const jobCacheValue = JSON.stringify({
				email,
				lastMessage: 'Put into a queue',
				status: EventStatusCode.INQUEUE
			} as JobStatusCacheValue)

			await this.redisService.set(
				`${jobNameCacheKey}:${jobId}`,
				jobCacheValue,
				'EX',
				3600
			)

			await this.aiClient.call('createAnalyseJob', {
				id: jobId,
				accountId: accountId,
				presetId: extendedPreset.preset.id,
				status: AnalyseStatus.INQUEUE
			})

			await this.queueService.sendResumeToProcess({
				preset: {
					presetId: extendedPreset.preset.id,
					temperature: extendedPreset.preset.temperature,
					maxTokens: extendedPreset.preset.maxTokens,
					systemPrompt: extendedPreset.preset.systemPrompt,
					usageCredits: extendedPreset.preset.usageCredits,
					llmName: extendedPreset.aiExternalModel.name,
					paidTier: extendedPreset.preset.paidTier,
					ownRule: extendedPreset.preset.ownRule
				},
				jobId,
				accountId,
				extractedText
			} as AiResumeUploadEventType)

			return jobId
		} catch (error: any) {
			throw new BadRequestException(
				error.details ?? error.message ?? 'Unable to upload resume'
			)
		}
	}

	@ApiOperation({
		summary: 'Get account analysed profiles',
		description: 'Provides analysed resumes of user'
	})
	@ApiOkResponse({
		description: 'Returns list of resumes',
		type: AccountProfilesResponse
	})
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiInternalServerErrorResponse({
		description: 'Failed to get personal data'
	})
	@ApiBearerAuth()
	@Protected()
	@UseInterceptors(FileInterceptor('resume'))
	@Get('profiles')
	@HttpCode(HttpStatus.OK)
	public async getProfiles(@CurrentUser('id') accountId: string) {
		return await this.aiClient.call('getAccountProfiles', { id: accountId })
	}
}
