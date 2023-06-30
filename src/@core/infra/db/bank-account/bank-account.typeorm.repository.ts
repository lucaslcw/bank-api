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

  async findById(id: string): Promise<BankAccount> {
    const model = await this.ormRepository.findOneBy({ id });
    if (model === null) {
      throw new Error('Could not find bank account.');
    }
    return new BankAccount({ account_number: model.account_number }, model.id);
  }
}
