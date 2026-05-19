import { Module } from '@nestjs/common';
import { AccountBillService } from './account-bill.service';
import { AccountBillController } from './account-bill.controller';

@Module({
  controllers: [AccountBillController],
  providers: [AccountBillService],
})
export class AccountBillModule {}
