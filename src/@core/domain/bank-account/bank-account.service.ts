import { BankAccount } from './bank-account';
import { BankAccountRepository } from './bank-account.repository';

export class BankAccountService {
  constructor(private readonly bankAccountRepository: BankAccountRepository) {}

  async create(account_number: string) {
    const bankAccount = new BankAccount({ account_number });
    await this.bankAccountRepository.insert(bankAccount);
    return bankAccount;
  }
}
