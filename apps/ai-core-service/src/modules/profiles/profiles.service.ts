import { GetMeRequest } from '@jrai/contracts/gen/account'
import {
	CreateCustomerProfileRequest,
	CustomerProfile,
	CustomerProfiles,
	ExtendedCustomerProfile
} from '@jrai/contracts/gen/aicore'
import { BoolValue } from '@jrai/contracts/gen/google/protobuf/wrappers'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'

import { QueueService } from '@/infrastructure/queue/queue.service'

import { ProfileRepository } from './profile.repository'

@Injectable()
export class ProfilesService {
	public constructor(
		private readonly repository: ProfileRepository,
		private readonly queue: QueueService
	) {}

	public async createProfile(
		request: CreateCustomerProfileRequest
	): Promise<BoolValue> {
		const newProfile = await this.repository.createProfile({
			...(request.profile as CustomerProfile),
			job: {
				connect: {
					id: request.jobId
				}
			}
		})

		if (!newProfile) {
			throw new GrpcException(
				RpcStatus.ABORTED,
				'Cannot create a new profile'
			)
		}

		this.queue.createJobForUser({
			accountId: newProfile.accountId,
			position: newProfile.predicatedPosition ?? 'All',
			tags: newProfile.tags,
			limit: 10
		})

		return { value: true }
	}

	public async getProfileById(id: string): Promise<CustomerProfile> {
		const newProfile = await this.repository.getProfileGyId(
			id,
			this.repository.profileSelect
		)

		if (!newProfile) {
			throw new GrpcException(RpcStatus.ABORTED, 'Cannot get profile')
		}

		return newProfile as CustomerProfile
	}

	public async getProfilesByAccount(
		request: GetMeRequest
	): Promise<CustomerProfiles> {
		const profiles = await this.repository.getAllAccountProfiles(
			request.id,
			this.repository.profileSecureSelect
		)

		if (!profiles) {
			throw new GrpcException(
				RpcStatus.ABORTED,
				'Cannot get user profile'
			)
		}
		return {
			data: profiles.map(p => {
				return {
					profile: p as CustomerProfile,
					presetName: p.job?.preset.name,
					spentCredits: p.job?.spentCredits
				} as ExtendedCustomerProfile
			})
		}
	}
}
