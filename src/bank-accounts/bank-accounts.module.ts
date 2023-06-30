import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { BankAccountSchema } from '../@core/infra/db/bank-account/bank-account.schema';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountService } from '../@core/domain/bank-account/bank-account.service';
import { DataSource } from 'typeorm';
import { BankAccountTypeOrmRepository } from '../@core/infra/db/bank-account/bank-account.typeorm.repository';
import { BankAccountRepository } from '../@core/domain/bank-account/bank-account.repository';
import { TransactionSchema } from '../@core/infra/db/transaction/transaction.schema';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccountSchema, TransactionSchema])],
  controllers: [BankAccountsController],
  providers: [
    {
      provide: BankAccountTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new BankAccountTypeOrmRepository(
          dataSource.getRepository(BankAccountSchema),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: BankAccountService,
      useFactory: (repository: BankAccountRepository) => {
        return new BankAccountService(repository);
      },
      inject: [BankAccountTypeOrmRepository],
    },
  ],
})
export class BankAccountsModule {}
