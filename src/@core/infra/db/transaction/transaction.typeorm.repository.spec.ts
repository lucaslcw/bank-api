import { DataSource, DeepPartial, Repository } from 'typeorm';
import { TransactionSchema } from './transaction.schema';
import { TransactionTypeOrmRepository } from './transaction.typeorm.repository';
import {
  Transaction,
  TransactionTypes,
} from '../../../domain/transaction/transaction';
import { BankAccountSchema } from '../bank-account/bank-account.schema';
import { BankAccountTypeOrmRepository } from '../bank-account/bank-account.typeorm.repository';
import { BankAccount } from '../../../domain/bank-account/bank-account';

describe('TransactionTypeOrmRepository', () => {
  let dataSource: DataSource;
  let bankAccountOrmRepository: Repository<BankAccountSchema>;
  let ormRepository: Repository<TransactionSchema>;
  let bankAccountRepository: BankAccountTypeOrmRepository;
  let repository: TransactionTypeOrmRepository;

  const createBankAccount = async (id?: string, account_number?: string) => {
    const bankAccount = new BankAccount(
      { account_number: account_number ?? '1111-11' },
      id ?? 'bank-account-id',
    );
    await bankAccountRepository.insert(bankAccount);
    return bankAccount;
  };

  const createTransaction = async (
    amount: number,
    type: TransactionTypes,
    bank_account: DeepPartial<BankAccountSchema>,
    id?: string,
  ) => {
    const transaction = new Transaction(
      {
        amount,
        type,
        bank_account: bank_account.id as DeepPartial<BankAccountSchema>,
      },
      0,
      id ?? 'transaction-id',
    );
    await repository.insert(transaction);
    return transaction;
  };

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [BankAccountSchema, TransactionSchema],
    });
    await dataSource.initialize();
    bankAccountOrmRepository = dataSource.getRepository(BankAccountSchema);
    ormRepository = dataSource.getRepository(TransactionSchema);
    bankAccountRepository = new BankAccountTypeOrmRepository(
      bankAccountOrmRepository,
    );
    repository = new TransactionTypeOrmRepository(ormRepository);

    jest.spyOn(repository, 'insert');
    jest.spyOn(repository, 'findAllByBankAccountId');
    jest.spyOn(repository, 'calculateBankAccountBalance');
    jest.spyOn(repository, 'transfer');
    jest.spyOn(bankAccountRepository, 'findById');
  });

  it('should insert a transaction', async () => {
    const bankAccount = await createBankAccount();
    const transaction = new Transaction(
      { amount: 100, bank_account: bankAccount, type: TransactionTypes.DEBIT },
      0,
      'transaction-id',
    );
    await repository.insert(transaction);
    const model = await ormRepository.findOne({
      where: { id: 'transaction-id' },
      loadRelationIds: true,
    });
    expect(repository.insert).toHaveBeenCalledTimes(1);
    expect(repository.insert).toHaveBeenCalledWith(transaction);
    expect(model.id).toBe('transaction-id');
    expect(model.amount).toBe(100);
    expect(model.type).toBe(TransactionTypes.DEBIT);
    expect(model.bank_account).toBe('bank-account-id');
  });

  it('should return all transactions from a bank account', async () => {
    const bankAccount = await createBankAccount();
    await createTransaction(100, TransactionTypes.DEBIT, bankAccount);
    const transactions = await repository.findAllByBankAccountId(
      bankAccount.id,
    );
    expect(repository.findAllByBankAccountId).toHaveBeenCalledTimes(1);
    expect(repository.findAllByBankAccountId).toHaveBeenCalledWith(
      bankAccount.id,
    );
    expect(transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'transaction-id',
          amount: 100,
          type: TransactionTypes.DEBIT,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        }),
      ]),
    );
  });

  it('should return 0 balance when there are no registered transactions', async () => {
    const bankAccount = await createBankAccount();
    const balance = await repository.calculateBankAccountBalance(
      bankAccount.id,
    );
    expect(repository.calculateBankAccountBalance).toHaveBeenCalledTimes(1);
    expect(repository.calculateBankAccountBalance).toHaveBeenCalledWith(
      bankAccount.id,
    );
    expect(balance).toBe(0);
  });

  it('should return the bank balance when there are registered transactions', async () => {
    const bankAccount = await createBankAccount();
    await createTransaction(100, TransactionTypes.DEBIT, bankAccount);
    const amount = await repository.calculateBankAccountBalance(bankAccount.id);
    expect(repository.calculateBankAccountBalance).toHaveBeenCalledTimes(1);
    expect(repository.calculateBankAccountBalance).toHaveBeenCalledWith(
      bankAccount.id,
    );
    expect(amount).toBe(100);
  });

  it('should create credit transaction for source account and debit for destination account', async () => {
    const bankAccountSource = await createBankAccount(
      'bank-account-1',
      '0000-00',
    );
    const bankAccountDestination = await createBankAccount(
      'bank-account-2',
      '1111-11',
    );
    await createTransaction(50, TransactionTypes.DEBIT, bankAccountSource);
    const transactionSource = new Transaction(
      {
        amount: 50,
        bank_account: bankAccountSource,
        type: TransactionTypes.CREDIT,
      },
      50,
      'transaction-source',
    );
    const transactionDestination = new Transaction(
      {
        amount: 50,
        bank_account: bankAccountDestination,
        type: TransactionTypes.DEBIT,
      },
      0,
      'transaction-destination',
    );
    await repository.transfer(transactionSource, transactionDestination);
    const transactionSourceModel = await ormRepository.findOne({
      where: { id: 'transaction-source' },
      loadRelationIds: true,
    });
    const transactionDestinationModel = await ormRepository.findOne({
      where: { id: 'transaction-destination' },
      loadRelationIds: true,
    });
    expect(repository.transfer).toHaveBeenCalledTimes(1);
    expect(repository.transfer).toHaveBeenCalledWith(
      transactionSource,
      transactionDestination,
    );
    expect(transactionSourceModel.amount).toBe(50);
    expect(transactionSourceModel.type).toBe(TransactionTypes.CREDIT);
    expect(transactionSourceModel.bank_account).toBe(bankAccountSource.id);
    expect(transactionDestinationModel.amount).toBe(50);
    expect(transactionDestinationModel.type).toBe(TransactionTypes.DEBIT);
    expect(transactionDestinationModel.bank_account).toBe(
      bankAccountDestination.id,
    );
  });
});
