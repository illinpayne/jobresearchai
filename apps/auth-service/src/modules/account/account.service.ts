import {
	ChangeAvatarRequest,
	ChangePersonalDataRequest
} from '@jrai/contracts/gen/account'
import { Account } from '@jrai/contracts/gen/auth'
import { GrpcException, RpcStatus } from '@jrai/contracts/grpc'
import { Injectable } from '@nestjs/common'

import { AccountRepository } from './account.repository'

@Injectable()
export class AccountService {
	public constructor(private readonly accountRepository: AccountRepository) {}

	public async getMe(id: string): Promise<Account> {
		return (await this.accountRepository.getById(id)) as Account
	}

	public async changePersonalData(
		request: ChangePersonalDataRequest
	): Promise<Account> {
		const findUser = await this.accountRepository.getById(request.id)
		if (!findUser) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Account not found')
		}

		const updatedUser = await this.accountRepository.updateAccount(
			{ email: findUser.email },
			{ firstName: request?.firstName, secondName: request?.secondName }
		)

		return updatedUser as Account
	}

	public async changeAvatar(request: ChangeAvatarRequest): Promise<Account> {
		const findUser = await this.accountRepository.getById(request.id)
		if (!findUser) {
			throw new GrpcException(RpcStatus.NOT_FOUND, 'Account not found')
		}

		const updatedUser = await this.accountRepository.updateAccount(
			{ email: findUser.email },
			{ avatar: request.avatar }
		)

		return updatedUser as Account
	}
}
