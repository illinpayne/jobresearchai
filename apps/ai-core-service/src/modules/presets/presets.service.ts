import {
	AiPreset,
	AiPresetsResponse,
	AssignPresetToUserRequest,
	AssignStatusResponse,
	ExtendedAiPreset,
	ExternalAi,
	GetPresetsByAccountRequest,
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
				this.presetRepository.onlyPresetIds
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

		const findPreset = await this.presetRepository.getPresetById(presetId)

		if (!findPreset) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Preset not found')
		}

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

	public async getExtendedPresetById(
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

	public async getExtendedPresetByAccount(
		request: GetPresetsByAccountRequest
	): Promise<ExtendedAiPreset> {
		try {
			const userPreset =
				await this.presetRepository.getExtendedPresetByAccount(
					request.presetId,
					request.accountId
				)
			if (!userPreset) {
				throw new GrpcException(
					RpcStatus.NOT_FOUND,
					`You don't have this preset`
				)
			}
			if (!userPreset.preset) {
				throw new GrpcException(RpcStatus.NOT_FOUND, 'Preset not found')
			}
			const { aiExternalModel, ...preset } = userPreset.preset

			return {
				preset: preset as AiPreset,
				aiExternalModel: aiExternalModel as ExternalAi
			} as ExtendedAiPreset
		} catch (error) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Presets not found')
		}
	}
}
