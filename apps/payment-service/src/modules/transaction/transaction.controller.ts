import { PAYMENT_SERVICE_NAME } from '@jrai/contracts/gen/payment'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { TransactionService } from './transaction.service'

@Controller()
export class TransactionController {
	public constructor(
		private readonly transactionService: TransactionService
	) {}

	@GrpcMethod(PAYMENT_SERVICE_NAME, 'GetTransactions')
	public async getTransactions(data: { accountId: string }) {
		const transactions = await this.transactionService.findAllByAccount(
			data.accountId
		)
		return { transactions }
	}
}
