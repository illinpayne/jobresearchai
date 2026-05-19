import type {
	CreateAccountBillRequest,
	GetAccountBillRequest,
	UpdateAccountBillRequest
} from '@jrai/contracts/gen/payment'
import { PAYMENT_SERVICE_NAME } from '@jrai/contracts/gen/payment'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { AccountBillService } from './account-bill.service'

@Controller()
export class AccountBillController {
	public constructor(
		private readonly accountBillService: AccountBillService
	) {}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'CreateAccountBill')
	public createAccountBill(data: CreateAccountBillRequest) {
		return this.accountBillService.create(data)
	}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'GetAccountBill')
	public getAccountBill(data: GetAccountBillRequest) {
		return this.accountBillService.findOne(data.accountId)
	}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'UpdateAccountBill')
	public updateAccountBill(data: UpdateAccountBillRequest) {
		const { accountId, ...dto } = data
		return this.accountBillService.update(accountId, dto)
	}
}
