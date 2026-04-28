import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger'

import { CurrentUser, Protected } from '@/common/decorators'

import { AicoreClientGrpc } from './aicore.grpc'
import { AiPresetResponse } from './responses/ai-preset.response'

@Controller('ai')
export class AiController {
	public constructor(private readonly aiClient: AicoreClientGrpc) {}

	@ApiOperation({
		summary: 'Gets all models',
		description: 'Gets all ai models for user'
	})
	@ApiOkResponse({
		description: 'Returns ai models',
		type: [AiPresetResponse]
	})
	@ApiNotFoundResponse({
		description: 'No ai models found'
	})
	@ApiBearerAuth()
	@Protected()
	@Get('models')
	@HttpCode(HttpStatus.OK)
	public async getAiModels() {
		const response = await this.aiClient.call('getAiPresets', {})
		if (!response.presets) {
			throw new NotFoundException('No AI models found')
		}
		return response
	}

	@ApiOperation({
		summary: 'Gets available models',
		description: 'Gets available ai models for user'
	})
	@ApiOkResponse({
		description: 'Returns ai models',
		type: [AiPresetResponse]
	})
	@ApiNotFoundResponse({
		description: 'No ai models found'
	})
	@ApiBearerAuth()
	@Protected()
	@Get('available-models')
	@HttpCode(HttpStatus.OK)
	public async getAvailableModels(@CurrentUser('id') id: string) {
		const response = await this.aiClient.call('getAvailablePresets', {
			userId: id
		})
		if (!response.presets) {
			throw new NotFoundException('No AI models found')
		}
		return response
	}
}
