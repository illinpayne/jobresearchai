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
import { TextCleaner } from '@/utils/text-cleaner.util'

import { UploadResumeDto } from './dtos/upload-resume.dto'

@Controller('resume')
export class ResumeController {
	public constructor(
		@Inject(PDF_PARSER) private readonly pdfParser: ResumeParser,
		@Inject(WORD_PARSER) private readonly wordParser: ResumeParser
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
			if (file.mimetype.includes('pdf')) {
				const text = await this.pdfParser.parse(file.buffer)
				const sanitized = TextCleaner.sanitize(text)
			} else {
				const text = await this.wordParser.parse(file.buffer)
			}
			return jobId
		} catch (error: any) {
			throw new BadRequestException(
				error.message ?? 'Unable to upload resume'
			)
		}
	}

	nl(text: string): string {
		if (!text) return ''

		return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
	}
}
