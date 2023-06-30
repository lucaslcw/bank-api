import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { TransactionSchema } from '../@core/infra/db/transaction/transaction.schema';
import { BankAccountSchema } from '../@core/infra/db/bank-account/bank-account.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionTypeOrmRepository } from '../@core/infra/db/transaction/transaction.typeorm.repository';
import { DataSource } from 'typeorm';
import { TransactionService } from '../@core/domain/transaction/transaction.service';
import { TransactionRepository } from '../@core/domain/transaction/transaction.repository';
import { BankAccountTypeOrmRepository } from '../@core/infra/db/bank-account/bank-account.typeorm.repository';
import { BankAccountRepository } from '../@core/domain/bank-account/bank-account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccountSchema, TransactionSchema])],
  controllers: [TransactionsController],
  providers: [
    {
      provide: TransactionTypeOrmRepository,
      useFactory: (dataSource: DataSource) => {
        return new TransactionTypeOrmRepository(
          dataSource.getRepository(TransactionSchema),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: TransactionService,
      useFactory: (
        repository: TransactionRepository,
        bankAccountRepository: BankAccountRepository,
      ) => {
        return new TransactionService(repository, bankAccountRepository);
      },
      inject: [TransactionTypeOrmRepository, BankAccountTypeOrmRepository],
    },
  ],
})
export class TransactionsModule {}
