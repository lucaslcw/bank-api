import { DataSource, DeepPartial, Repository } from 'typeorm';
import { TransactionSchema } from '../../infra/db/transaction/transaction.schema';
import { TransactionTypeOrmRepository } from '../../infra/db/transaction/transaction.typeorm.repository';
import { TransactionService } from './transaction.service';
import { BankAccountSchema } from '../../infra/db/bank-account/bank-account.schema';
import { BankAccountTypeOrmRepository } from '../../infra/db/bank-account/bank-account.typeorm.repository';
import { BankAccount } from '../bank-account/bank-account';
import { Transaction, TransactionTypes } from './transaction';

describe('TransactionService', () => {
  let dataSource: DataSource;
  let ormRepository: Repository<TransactionSchema>;
  let bankAccountOrmRepository: Repository<BankAccountSchema>;
  let repository: TransactionTypeOrmRepository;
  let bankAccountRepository: BankAccountTypeOrmRepository;
  let transactionService: TransactionService;

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
      entities: [TransactionSchema, BankAccountSchema],
    });
    await dataSource.initialize();
    ormRepository = dataSource.getRepository(TransactionSchema);
    bankAccountOrmRepository = dataSource.getRepository(BankAccountSchema);
    bankAccountRepository = new BankAccountTypeOrmRepository(
      bankAccountOrmRepository,
    );
    repository = new TransactionTypeOrmRepository(ormRepository);
    transactionService = new TransactionService(
      repository,
      bankAccountRepository,
    );

    jest.spyOn(transactionService, 'getBankAccountBalance');
    jest.spyOn(transactionService, 'getExtract');
    jest.spyOn(transactionService, 'create');
    jest.spyOn(transactionService, 'transfer');
    jest.spyOn(bankAccountRepository, 'findById');
  });

  it('should create a new transaction', async () => {
    const bankAccount = await createBankAccount();
    await transactionService.create(
      bankAccount.id,
      TransactionTypes.DEBIT,
      100,
    );
    const model = await ormRepository.findOne({
      where: { bank_account: { id: bankAccount.id } },
      loadRelationIds: true,
    });
    expect(bankAccountRepository.findById).toHaveBeenCalledTimes(1);
    expect(bankAccountRepository.findById).toHaveBeenCalledWith(bankAccount.id);
    expect(transactionService.create).toHaveBeenCalledTimes(1);
    expect(transactionService.create).toHaveBeenLastCalledWith(
      bankAccount.id,
      TransactionTypes.DEBIT,
      100,
    );
    expect(model.id).toBeDefined();
    expect(model.amount).toBe(100);
    expect(model.type).toBe(TransactionTypes.DEBIT);
    expect(model.bank_account).toBe('bank-account-id');
  });

  it('should return all transactions from a bank account', async () => {
    const bankAccount = await createBankAccount();
    await createTransaction(100, TransactionTypes.DEBIT, bankAccount);
    const transactions = await transactionService.getExtract(bankAccount.id);
    expect(bankAccountRepository.findById).toHaveBeenCalledTimes(1);
    expect(bankAccountRepository.findById).toHaveBeenCalledWith(bankAccount.id);
    expect(transactionService.getExtract).toHaveBeenCalledTimes(1);
    expect(transactionService.getExtract).toHaveBeenCalledWith(bankAccount.id);
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

  it('should return the bank account balance', async () => {
    const bankAccount = await createBankAccount();
    await createTransaction(100, TransactionTypes.DEBIT, bankAccount);
    const balance = await transactionService.getBankAccountBalance(
      bankAccount.id,
    );
    expect(bankAccountRepository.findById).toHaveBeenCalledTimes(1);
    expect(bankAccountRepository.findById).toHaveBeenCalledWith(bankAccount.id);
    expect(transactionService.getBankAccountBalance).toBeCalledTimes(1);
    expect(transactionService.getBankAccountBalance).toBeCalledWith(
      bankAccount.id,
    );
    expect(balance).toBe(100);
  });

  it('should credit the value of the source bank account and debit the destination bank account', async () => {
    const transferAmount = 50;
    const bankAccountSource = await createBankAccount(
      'bank-account-1',
      '0000-00',
    );
    const bankAccountDestination = await createBankAccount(
      'bank-account-2',
      '1111-11',
    );
    await createTransaction(
      transferAmount,
      TransactionTypes.DEBIT,
      bankAccountSource,
    );
    await transactionService.transfer(
      bankAccountSource.id,
      bankAccountDestination.id,
      transferAmount,
    );
    const bankAccountSourceBalance =
      await transactionService.getBankAccountBalance(bankAccountSource.id);
    const bankAccountDestinationBalance =
      await transactionService.getBankAccountBalance(bankAccountDestination.id);
    expect(bankAccountRepository.findById).toHaveBeenCalledWith(
      bankAccountSource.id,
    );
    expect(bankAccountRepository.findById).toHaveBeenCalledWith(
      bankAccountDestination.id,
    );
    expect(transactionService.transfer).toHaveBeenCalledTimes(1);
    expect(transactionService.transfer).toHaveBeenCalledWith(
      bankAccountSource.id,
      bankAccountDestination.id,
      transferAmount,
    );
    expect(bankAccountSourceBalance).toBe(0);
    expect(bankAccountDestinationBalance).toBe(50);
  });

  it('should rethrow 404 when trying to create transaction with invalid bank account id', async () => {
    const promise = transactionService.create(
      'any-bank-account-id',
      TransactionTypes.DEBIT,
      100,
    );
    await expect(promise).rejects.toThrowError('Could not find bank account.');
  });

  it('should rethrow 404 when trying to return all transactions from a bank account with invalid bank account id', async () => {
    const promise = transactionService.getExtract('any-bank-account-id');
    await expect(promise).rejects.toThrowError('Could not find bank account.');
  });

  it('should rethrow 404 when trying to return the bank account balance with invalid bank account id', async () => {
    const promise = transactionService.getBankAccountBalance(
      'any-bank-account-id',
    );
    await expect(promise).rejects.toThrowError('Could not find bank account.');
  });

  it('should rethrow 404 when trying to transfer a value with invalid bank account id', async () => {
    const promise = transactionService.transfer(
      'any-bank-account-id',
      'any-bank-account-id',
      50,
    );
    await expect(promise).rejects.toThrowError('Could not find bank account.');
  });
});
