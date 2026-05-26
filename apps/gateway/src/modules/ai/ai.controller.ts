import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation
} from '@nestjs/swagger'

import { CurrentUser, Protected } from '@/common/decorators'
import { TIER_ORDER } from '@/shared/plans'

import { BillingClientGrpc } from '../billing/billing.grpc'

import { AicoreClientGrpc } from './aicore.grpc'
import { GetModelDto } from './dtos/get-model.dto'
import {
	AiSecuredPresetsResponse,
	AssignPresetResponse
} from './responses/ai-preset.response'
import { SimplifiedAnalyseJobWithPresetResponse } from './responses/jobs-in-progress.response'

@Controller('ai')
export class AiController {
	public constructor(
		private readonly aiClient: AicoreClientGrpc,
		private readonly billingClient: BillingClientGrpc
	) {}

	@ApiOperation({
		summary: 'Gets ai models',
		description: 'Gets all ai models'
	})
	@ApiOkResponse({
		description: 'Returns ai models',
		type: AiSecuredPresetsResponse
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
		const findPreset = await this.aiClient.call('getExtendedPresetById', {
			presetId: dto.presetId
		})
		if (!findPreset || !findPreset.preset) {
			throw new NotFoundException('Preset not found')
		}

		if (findPreset.preset.paidTier !== 'Free') {
			const billingInfo = await this.billingClient.call(
				'getSubscription',
				{
					accountId: id
				}
			)

			if (!billingInfo.plan) {
				throw new BadRequestException('Billing plan not found.')
			}

			const featureTier = findPreset.preset.paidTier as string
			const userTier = billingInfo.plan.name as string

			const featureRank = TIER_ORDER.indexOf(featureTier)
			const userRank = TIER_ORDER.indexOf(userTier)

			if (
				featureRank === -1 ||
				userRank === -1 ||
				userRank < featureRank
			) {
				throw new BadRequestException(
					`You don't have access to this model.`
				)
			}
		}

		const response = await this.aiClient.call('assignPresetToUser', {
			userId: id,
			presetId: findPreset.preset.id
		})
		if (!response.status) {
			throw new NotFoundException('Cannot get this model.')
		}
		return response
	}

	@ApiOperation({
		summary: 'Gets jobs in progress',
		description: 'Gets all jobs in progress'
	})
	@ApiOkResponse({
		description: 'Returns jobs in progress',
		type: SimplifiedAnalyseJobWithPresetResponse
	})
	@ApiNotFoundResponse({
		description: 'Jobs not found'
	})
	@ApiBearerAuth()
	@Protected()
	@Get('jobs-in-progress')
	@HttpCode(HttpStatus.OK)
	public async getJobsInProgress(@CurrentUser('id') id: string) {
		const response = await this.aiClient.call('getAccountJobInProgress', {
			id: id
		})
		return response
	}
}
