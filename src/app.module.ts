import { Module } from '@nestjs/common';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountSchema } from './@core/infra/db/bank-account/bank-account.schema';
import { TransactionSchema } from './@core/infra/db/transaction/transaction.schema';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './db.sqlite',
      synchronize: true,
      entities: [BankAccountSchema, TransactionSchema],
    }),
    BankAccountsModule,
    TransactionsModule,
  ],
})
export class AppModule {}
