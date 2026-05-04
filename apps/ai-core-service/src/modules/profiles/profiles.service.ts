import { CustomerProfile } from '@jrai/contracts/gen/aicore'
import { BoolValue } from '@jrai/contracts/gen/google/protobuf/wrappers'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'

import { ProfileRepository } from './profile.repository'

@Injectable()
export class ProfilesService {
	public constructor(private readonly repository: ProfileRepository) {}

	public async createProfile(profile: CustomerProfile): Promise<BoolValue> {
		const newProfile = await this.repository.createProfile(profile)

		if (!newProfile) {
			throw new GrpcException(
				RpcStatus.ABORTED,
				'Cannot create a new profile'
			)
		}

		return { value: true }
	}

	public async getProfileById(id: string): Promise<CustomerProfile> {
		const newProfile = await this.repository.getProfileGyId(
			id,
			this.repository.profileSelect
		)

		if (!newProfile) {
			throw new GrpcException(
				RpcStatus.ABORTED,
				'Cannot create a new profile'
			)
		}

		return newProfile as CustomerProfile
	}
}
