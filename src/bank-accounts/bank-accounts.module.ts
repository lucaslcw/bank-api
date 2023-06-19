import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { BankAccountSchema } from '../@core/infra/db/bank-account/bank-account.schema';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountService } from '../@core/domain/bank-account/bank-account.service';
import { DataSource } from 'typeorm';
import { BankAccountTypeOrmRepository } from '../@core/infra/db/bank-account/bank-account.typeorm.repository';
import { BankAccountRepository } from '../@core/domain/bank-account/bank-account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccountSchema])],
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
      useFactory: (
        repository: BankAccountRepository,
        dataSource: DataSource,
      ) => {
        return new BankAccountService(repository, dataSource);
      },
      inject: [BankAccountTypeOrmRepository, getDataSourceToken()],
    },
  ],
})
export class BankAccountsModule {}
