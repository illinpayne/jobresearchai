import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post,
	Query
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger'

import { CurrentUser, Protected } from '@/common/decorators'

import { AicoreClientGrpc } from './aicore.grpc'
import { GetModelDto } from './dtos/get-model.dto'
import {
	AiPresetsResponse,
	AssignPresetResponse
} from './responses/ai-preset.response'

@Controller('ai')
export class AiController {
	public constructor(private readonly aiClient: AicoreClientGrpc) {}

	@ApiOperation({
		summary: 'Gets ai models',
		description: 'Gets all ai models'
	})
	@ApiOkResponse({
		description: 'Returns ai models',
		type: AiPresetsResponse
	})
	@ApiNotFoundResponse({
		description: 'No ai models found'
	})
	@ApiBearerAuth()
	@Protected()
	@Get('models')
	@HttpCode(HttpStatus.OK)
	public async getModelList(@CurrentUser('id') id: string) {
		const response = await this.aiClient.call('getPresets', {
			userId: id
		})
		if (!response.presets) {
			throw new NotFoundException('No AI models found')
		}
		return response
	}

	@ApiOperation({
		summary: 'Get model to use',
		description: 'Adding model for using in generation'
	})
	@ApiOkResponse({
		description: 'Adding ai model to library',
		type: AssignPresetResponse
	})
	@ApiNotFoundResponse({
		description: 'No ai models found'
	})
	@ApiBearerAuth()
	@Protected()
	@Post('get-model')
	@HttpCode(HttpStatus.OK)
	public async getModelToUser(
		@CurrentUser('id') id: string,
		@Body() dto: GetModelDto
	) {
		const response = await this.aiClient.call('assignPresetToUser', {
			userId: id,
			presetId: dto.presetId
		})
		if (!response.status) {
			throw new NotFoundException('Cannot get this model.')
		}
		return response
	}
}
