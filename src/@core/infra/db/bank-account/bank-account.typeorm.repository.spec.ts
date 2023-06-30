import { BankAccountSchema } from './bank-account.schema';
import { DataSource, Repository } from 'typeorm';
import { BankAccountTypeOrmRepository } from './bank-account.typeorm.repository';
import { BankAccount } from '../../../domain/bank-account/bank-account';
import { TransactionSchema } from '../transaction/transaction.schema';

describe('BankAccountTypeOrmRepository', () => {
  let dataSource: DataSource;
  let ormRepository: Repository<BankAccountSchema>;
  let repository: BankAccountTypeOrmRepository;

  const createBankAccount = async (id?: string) => {
    const bankAccount = new BankAccount(
      { account_number: '1111-11' },
      id ?? 'bank-account-id',
    );
    await repository.insert(bankAccount);
    return bankAccount;
  };

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [BankAccountSchema, TransactionSchema],
    });
    await dataSource.initialize();
    ormRepository = dataSource.getRepository(BankAccountSchema);
    repository = new BankAccountTypeOrmRepository(ormRepository);

    jest.spyOn(repository, 'insert');
    jest.spyOn(repository, 'findById');
  });

  it('should insert a bank account', async () => {
    const bankAccount = await createBankAccount('bank-account-id');
    const model = await ormRepository.findOneBy({ account_number: '1111-11' });
    expect(repository.insert).toHaveBeenCalledTimes(1);
    expect(repository.insert).toHaveBeenCalledWith(bankAccount);
    expect(model.id).toBe('bank-account-id');
    expect(model.account_number).toBe('1111-11');
  });

  it('should return a bank account by id', async () => {
    const bankAccount = await createBankAccount('bank-account-id');
    const model = await repository.findById(bankAccount.id);
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith(bankAccount.id);
    expect(model.id).toBe('bank-account-id');
    expect(model.account_number).toBe('1111-11');
  });

  it('should throw 404 when not find bank account with id', async () => {
    const promise = repository.findById('any-id');
    expect(repository.findById).toHaveBeenCalledTimes(1);
    expect(repository.findById).toHaveBeenCalledWith('any-id');
    await expect(promise).rejects.toThrowError('Could not find bank account.');
  });
});
