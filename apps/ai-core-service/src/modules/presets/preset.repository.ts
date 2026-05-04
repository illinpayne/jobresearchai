import { Injectable } from '@nestjs/common'
import {
	AiExternalModelCreateInput,
	AiModelPresetCreateInput,
	AiModelPresetSelect,
	UserPresetSelect
} from '@prisma/generated/models'

import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class PresetRepository {
	public readonly presetSelect = {
		id: true,
		name: true,
		description: true,
		stars: true,
		usageCredits: true,
		paidTier: true,
		temperature: true,
		systemPrompt: true,
		maxTokens: true
	} as const
	public readonly externalModelSelect = {
		id: true,
		name: true
	} as const
	public readonly onlyIds = {
		id: true
	} as const
	public readonly onlyPresetIds = {
		presetId: true
	} as const
	public constructor(private readonly prismaService: PrismaService) {}

	public async getAllPresets() {
		const presets = await this.prismaService.aiModelPreset.findMany({
			select: this.presetSelect
		})
		return presets
	}

	public async getOwnedPresets(accountId: string, select?: UserPresetSelect) {
		const presets = await this.prismaService.userPreset.findMany({
			where: { accountId: accountId },
			select
		})
		return presets
	}

	public async getPresetById(id: string, select?: AiModelPresetSelect) {
		const preset = await this.prismaService.aiModelPreset.findUnique({
			where: { id },
			select
		})
		return preset
	}

	public async getExtendedPresetById(id: string) {
		const preset = await this.prismaService.aiModelPreset.findUnique({
			where: { id },
			select: {
				aiExternalModel: {
					select: this.externalModelSelect
				},
				...this.presetSelect
			}
		})
		return preset
	}

	public async getExtendedPresetByAccount(id: string, accountId: string) {
		const userPreset = await this.prismaService.userPreset.findUnique({
			where: {
				accountId_presetId: {
					accountId: accountId,
					presetId: id
				}
			},
			select: {
				preset: {
					select: {
						aiExternalModel: {
							select: this.externalModelSelect
						},
						...this.presetSelect
					}
				}
			}
		})
		return userPreset
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
