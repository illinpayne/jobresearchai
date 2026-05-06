import type { GetMeRequest } from '@jrai/contracts/gen/account'
import {
	AI_CORE_SERVICE_NAME,
	type CreateCustomerProfileRequest,
	type CustomerProfile,
	CustomerProfiles
} from '@jrai/contracts/gen/aicore'
import { BoolValue } from '@jrai/contracts/gen/google/protobuf/wrappers'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { ProfilesService } from './profiles.service'

@Controller()
export class ProfilesController {
	constructor(private readonly profilesService: ProfilesService) {}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'CreateProfile')
	public async createCustomerProfile(
		request: CreateCustomerProfileRequest
	): Promise<BoolValue> {
		return this.profilesService.createProfile(request)
	}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'GetProfileById')
	public async GetProfileById(request: string): Promise<CustomerProfile> {
		return this.profilesService.getProfileById(request)
	}

	@GrpcMethod(AI_CORE_SERVICE_NAME, 'GetAccountProfiles')
	public async GetAccountProfiles(
		request: GetMeRequest
	): Promise<CustomerProfiles> {
		return this.profilesService.getProfilesByAccount(request)
	}
}
