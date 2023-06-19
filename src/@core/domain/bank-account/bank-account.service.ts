import { DataSource } from 'typeorm';
import { BankAccount } from './bank-account';
import { BankAccountTransferService } from './bank-account-transfer.service';
import { BankAccountRepository } from './bank-account.repository';
import { BankAccountSchema } from '../../infra/db/bank-account/bank-account.schema';

export class BankAccountService {
  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(account_number: string) {
    const bankAccount = new BankAccount({ account_number, balance: 0 });
    await this.bankAccountRepository.insert(bankAccount);
    return bankAccount;
  }

  async transfer(
    account_number_source: string,
    account_number_destination: string,
    amount: number,
  ) {
    const bankAccountSource =
      await this.bankAccountRepository.findByAccountNumber(
        account_number_source,
      );
    const bankAccountDestination =
      await this.bankAccountRepository.findByAccountNumber(
        account_number_destination,
      );
    const bankAccountTransferService = new BankAccountTransferService();
    bankAccountTransferService.transfer(
      bankAccountSource,
      bankAccountDestination,
      amount,
    );
    await this.dataSource.transaction(async (entity) => {
      await entity.update(BankAccountSchema, bankAccountSource.id, {
        balance: bankAccountSource.balance,
      });
      await entity.update(BankAccountSchema, bankAccountDestination.id, {
        balance: bankAccountDestination.balance,
      });
    });
  }
}
