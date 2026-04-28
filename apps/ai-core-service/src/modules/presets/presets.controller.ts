import {
	AI_CORE_SERVICE_NAME,
	AiPresetsResponse,
	type AssignPresetToUserRequest,
	AssignStatusResponse,
	type GetAvailablePresetsRequest
} from '@jrai/contracts/gen/aicore'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { PresetsService } from './presets.service'

@Controller()
export class PresetsController {
	constructor(private readonly presetsService: PresetsService) {}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'GetAiPresets')
	public async getAiPresets(): Promise<AiPresetsResponse> {
		return this.presetsService.getAllPresets()
	}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'GetAvailablePresets')
	public async getAvailablePresets(
		request: GetAvailablePresetsRequest
	): Promise<AiPresetsResponse> {
		return this.presetsService.getUserPresets(request)
	}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'AssignPresetToUser')
	public async AssignPresetToUser(
		request: AssignPresetToUserRequest
	): Promise<AssignStatusResponse> {
		return await this.presetsService.assignPresetToUser(request)
	}
}
