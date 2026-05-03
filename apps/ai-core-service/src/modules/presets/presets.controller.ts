import {
	AI_CORE_SERVICE_NAME,
	AiPreset,
	AiPresetsResponse,
	type AssignPresetToUserRequest,
	AssignStatusResponse,
	ExtendedAiPreset,
	type GetPresetsByIdRequest,
	type GetPresetsRequest
} from '@jrai/contracts/gen/aicore'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { PresetsService } from './presets.service'

@Controller()
export class PresetsController {
	constructor(private readonly presetsService: PresetsService) {}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'GetPresets')
	public async getAiPresets(
		request: GetPresetsRequest
	): Promise<AiPresetsResponse> {
		return this.presetsService.getAllPresets(request)
	}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'AssignPresetToUser')
	public async AssignPresetToUser(
		request: AssignPresetToUserRequest
	): Promise<AssignStatusResponse> {
		return await this.presetsService.assignPresetToUser(request)
	}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'GetPresetById')
	public async getAiPresetById(
		request: GetPresetsByIdRequest
	): Promise<AiPreset> {
		return this.presetsService.getPresetById(request)
	}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'GetLLMByPresetId')
	public async getAiLLMByPresetId(
		request: GetPresetsByIdRequest
	): Promise<ExtendedAiPreset> {
		return this.presetsService.getLLMByPresetId(request)
	}
}
