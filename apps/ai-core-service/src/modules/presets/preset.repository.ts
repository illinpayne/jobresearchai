import { Injectable } from '@nestjs/common'
import {
	AiExternalModelCreateInput,
	AiModelPresetCreateInput,
	AiModelPresetSelect
} from '@prisma/generated/models'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class PresetRepository {
	public readonly presetSelect: {
		id: true
		name: true
		description: true
		stars: true
		usageTokens: true
		paidTier: true
		temperature: true
	}
	public readonly externalModelSelect: {
		id: true
		name: true
	}
	public readonly onlyIds: {
		id: true
	}
	public constructor(private readonly prismaService: PrismaService) {}

	public async getAllPresets() {
		const presets = await this.prismaService.aiModelPreset.findMany({
			select: this.presetSelect
		})
		return presets
	}

	public async getOwnedPresets(
		accountId: string,
		select?: AiModelPresetSelect
	) {
		const presets = await this.prismaService.userPreset.findMany({
			where: { accountId },
			select
		})
		return presets
	}

	public async getPresetById(id: string, select: AiModelPresetSelect) {
		const preset = await this.prismaService.aiModelPreset.findUnique({
			where: { id },
			select
		})
		return preset
	}

	public async addExternalModel(model: AiExternalModelCreateInput) {
		const externalModel = await this.prismaService.aiExternalModel.create({
			data: model,
			select: this.externalModelSelect
		})
		return externalModel
	}

	public async addPreset(model: AiModelPresetCreateInput) {
		const externalModel = await this.prismaService.aiModelPreset.create({
			data: model,
			select: this.presetSelect
		})
		return externalModel
	}

	public async assignPresetToUser(accountId: string, presetId: string) {
		const assignment = await this.prismaService.userPreset.create({
			data: {
				accountId,
				presetId: presetId
			}
		})
		return assignment
	}

	public async unassignPresetToUser(accountId: string, presetId: string) {
		const assignment = await this.prismaService.userPreset.delete({
			where: {
				accountId_presetId: {
					accountId,
					presetId
				}
			}
		})
		return assignment
	}
}
