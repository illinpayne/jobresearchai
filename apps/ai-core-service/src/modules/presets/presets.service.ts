import {
	AiPreset,
	AiPresetsResponse,
	AssignPresetToUserRequest,
	AssignStatusResponse,
	GetPresetsRequest
} from '@jrai/contracts/gen/aicore'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'

import { PresetRepository } from './preset.repository'

@Injectable()
export class PresetsService {
	public constructor(private readonly presetRepository: PresetRepository) {}

	public async getAllPresets(
		request: GetPresetsRequest
	): Promise<AiPresetsResponse> {
		try {
			const presets = await this.presetRepository.getAllPresets()
			const ownedIds = await this.presetRepository.getOwnedPresets(
				request.userId,
				this.presetRepository.onlyIds
			)
			return {
				presets: presets as AiPreset[],
				ownedPresetIds: ownedIds.map(p => p.presetId) ?? []
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
