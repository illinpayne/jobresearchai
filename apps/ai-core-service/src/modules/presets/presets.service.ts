import {
	AiPreset,
	AiPresetsResponse,
	AssignPresetToUserRequest,
	AssignStatusResponse,
	ExtendedAiPreset,
	ExternalAi,
	GetPresetsByIdRequest,
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

	public async getPresetById(
		request: GetPresetsByIdRequest
	): Promise<AiPreset> {
		try {
			const preset = await this.presetRepository.getPresetById(
				request.presetId,
				this.presetRepository.presetSelect
			)
			if (!preset) {
				throw new GrpcException(RpcStatus.NOT_FOUND, 'Preset not found')
			}
			return preset as AiPreset
		} catch (error) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Presets not found')
		}
	}

	public async getLLMByPresetId(
		request: GetPresetsByIdRequest
	): Promise<ExtendedAiPreset> {
		try {
			const extendedPreset =
				await this.presetRepository.getExtendedPresetById(
					request.presetId
				)
			if (!extendedPreset) {
				throw new GrpcException(RpcStatus.NOT_FOUND, 'Preset not found')
			}
			const { aiExternalModel, ...preset } = extendedPreset

			return {
				preset: preset as AiPreset,
				aiExternalModel: aiExternalModel as ExternalAi
			} as ExtendedAiPreset
		} catch (error) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Presets not found')
		}
	}
}
