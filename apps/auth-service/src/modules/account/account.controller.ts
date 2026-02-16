import { ACCOUNT_SERVICE_NAME } from '@jrai/contracts/gen/account'
import type {
	ChangeAvatarRequest,
	ChangePersonalDataRequest,
	GetMeRequest
} from '@jrai/contracts/gen/account'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { AccountService } from './account.service'

@Controller()
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@GrpcMethod(ACCOUNT_SERVICE_NAME, 'GetMe')
	public async getMe(request: GetMeRequest) {
		return await this.accountService.getMe(request.id)
	}

	@GrpcMethod(ACCOUNT_SERVICE_NAME, 'ChangePersonalData')
	public async changePersonalData(request: ChangePersonalDataRequest) {
		return await this.accountService.changePersonalData(request)
	}

	@GrpcMethod(ACCOUNT_SERVICE_NAME, 'ChangeAvatar')
	public async changeAvatar(request: ChangeAvatarRequest) {
		return await this.accountService.changeAvatar(request)
	}
}
