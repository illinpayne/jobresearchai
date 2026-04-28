import {
	AiPreset,
	AiPresetsResponse,
	AssignPresetToUserRequest,
	AssignStatusResponse,
	GetAvailablePresetsRequest
} from '@jrai/contracts/gen/aicore'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'

import { PresetRepository } from './preset.repository'

@Injectable()
export class PresetsService {
	public constructor(private readonly presetRepository: PresetRepository) {}

	public async getAllPresets(): Promise<AiPresetsResponse> {
		try {
			const presets = await this.presetRepository.getAllPresets()
			return {
				presets: presets as AiPreset[]
			}
		} catch (error) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Presets not found')
		}
	}

	public async getUserPresets(
		request: GetAvailablePresetsRequest
	): Promise<AiPresetsResponse> {
		const { userId } = request
		try {
			const userPresets =
				await this.presetRepository.getUserPresets(userId)
			return {
				presets: userPresets.map(up => up.preset) as AiPreset[]
			}
		} catch (error) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Presets not found')
		}
	}

	public async assignPresetToUser(
		request: AssignPresetToUserRequest
	): Promise<AssignStatusResponse> {
		const { userId, presetId } = request

		try {
			await this.presetRepository.assignPresetToUser(userId, presetId)
			return {
				status: true
			}
		} catch (error) {
			throw new GrpcException(
				RpcStatus.ABORTED,
				'Cannot assign preset to user'
			)
		}
	}
}
