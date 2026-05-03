import { ExtendedAiPreset } from '@jrai/contracts/gen/aicore'
import {
	BadGatewayException,
	BadRequestException,
	Body,
	Controller,
	FileTypeValidator,
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
import { TextCleaner } from '@/utils/text-cleaner.util'

import { AicoreClientGrpc } from '../ai/aicore.grpc'

import { UploadResumeDto } from './dtos/upload-resume.dto'

@Controller('resume')
export class ResumeController {
	public constructor(
		@Inject(PDF_PARSER) private readonly pdfParser: ResumeParser,
		@Inject(WORD_PARSER) private readonly wordParser: ResumeParser,
		private readonly aiClient: AicoreClientGrpc,
		private readonly queueService: QueueService
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
		@CurrentUser() user: any,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new FileTypeValidator({
						fileType:
							'.(pdf|vnd.openxmlformats-officedocument.wordprocessingml.document)$'
					}),
					new MaxFileSizeValidator({ maxSize: 0.5 * 1024 * 1024 })
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
			const jobId = nanoid()
			let extractedText = ''
			if (file.mimetype.includes('pdf')) {
				const text = await this.pdfParser.parse(file.buffer)
				extractedText = TextCleaner.sanitize(text)
			} else {
				extractedText = await this.wordParser.parse(file.buffer)
			}
			const extendedPreset: ExtendedAiPreset = await this.aiClient.call(
				'getLlmByPresetId',
				{
					presetId: dto.presetId
				}
			)
			if (!extendedPreset.preset || !extendedPreset.aiExternalModel) {
				throw new BadRequestException(
					'Invalid preset or LLM configuration'
				)
			}
			await this.queueService.sendResumeToProcess({
				extractedText,
				temperature: extendedPreset.preset.temperature,
				llm: extendedPreset.aiExternalModel.name
			})

			return jobId
		} catch (error: any) {
			throw new BadRequestException(
				error.details ?? error.message ?? 'Unable to upload resume'
			)
		}
	}
}
