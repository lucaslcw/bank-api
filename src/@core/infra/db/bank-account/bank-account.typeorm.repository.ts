import { BankAccount } from '../../../domain/bank-account/bank-account';
import { BankAccountRepository } from '../../../domain/bank-account/bank-account.repository';
import { BankAccountSchema } from './bank-account.schema';
import { Repository } from 'typeorm';

export class BankAccountTypeOrmRepository implements BankAccountRepository {
  constructor(private readonly ormRepository: Repository<BankAccountSchema>) {}

  async insert(bankAccount: BankAccount): Promise<void> {
    const model = this.ormRepository.create(bankAccount);
    await this.ormRepository.insert(model);
  }

  async findByAccountNumber(
    accountNumber: string,
  ): Promise<BankAccount | null> {
    const model = await this.ormRepository.findOneByOrFail({
      account_number: accountNumber,
    });
    return new BankAccount(
      { account_number: model.account_number, balance: model.balance },
      model.id,
    );
  }

  async update(bankAccount: BankAccount): Promise<void> {
    await this.ormRepository.update(bankAccount.id, {
      balance: bankAccount.balance,
    });
  }
}
