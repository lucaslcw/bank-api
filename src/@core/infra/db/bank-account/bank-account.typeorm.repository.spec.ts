import { BankAccountSchema } from './bank-account.schema';
import { DataSource, Repository } from 'typeorm';
import { BankAccountTypeOrmRepository } from './bank-account.typeorm.repository';
import { BankAccount } from '../../../domain/bank-account/bank-account';

describe('BankAccountTypeOrmRepository', () => {
  let dataSource: DataSource;
  let ormRepository: Repository<BankAccountSchema>;
  let repository: BankAccountTypeOrmRepository;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [BankAccountSchema],
    });
    await dataSource.initialize();
    ormRepository = dataSource.getRepository(BankAccountSchema);
    repository = new BankAccountTypeOrmRepository(ormRepository);
  });

  it('should insert a bank account', async () => {
    const bankAccount = new BankAccount(
      {
        account_number: '1111-11',
        balance: 100,
      },
      '123',
    );
    await repository.insert(bankAccount);
    const model = await ormRepository.findOneBy({ account_number: '1111-11' });
    expect(model.id).toBe('123');
    expect(model.balance).toBe(100);
    expect(model.account_number).toBe('1111-11');
  });
});
