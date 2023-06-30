import { DeepPartial } from 'typeorm';
import { Transaction, TransactionTypes } from './transaction';
import { BankAccountSchema } from '../../../@core/infra/db/bank-account/bank-account.schema';

describe('TransactionEntity', () => {
  it('should create a credit transaction', () => {
    const transaction = new Transaction(
      {
        amount: 10,
        type: TransactionTypes.DEBIT,
        bank_account: '123' as DeepPartial<BankAccountSchema>,
      },
      0,
      '123',
    );
    expect(transaction.id).toBe('123');
    expect(transaction.amount).toBe(10);
    expect(transaction.type).toBe(TransactionTypes.DEBIT);
    expect(transaction.bank_account).toBe('123');
  });

  it('should create a debit transaction', () => {
    const transaction = new Transaction(
      {
        amount: 10,
        type: TransactionTypes.DEBIT,
        bank_account: '123' as DeepPartial<BankAccountSchema>,
      },
      0,
      '123',
    );
    expect(transaction.id).toBe('123');
    expect(transaction.amount).toBe(10);
    expect(transaction.type).toBe(TransactionTypes.DEBIT);
    expect(transaction.bank_account).toBe('123');
  });

  it('should return error if transaction type is different from debit or credit', () => {
    expect(() => {
      new Transaction({
        amount: 10,
        type: 'TEST' as TransactionTypes,
        bank_account: '123' as DeepPartial<BankAccountSchema>,
      });
    }).toThrow('Operation not allowed.');
  });

  it('should return error if transaction value is <= 0', () => {
    expect(() => {
      new Transaction(
        {
          amount: 0,
          type: TransactionTypes.CREDIT,
          bank_account: '123' as DeepPartial<BankAccountSchema>,
        },
        0,
      );
    }).toThrow('Unable to generate a transaction with value 0.');
  });

  it('should return error if bank account balance is not reported', () => {
    expect(() => {
      new Transaction({
        amount: 0,
        type: TransactionTypes.CREDIT,
        bank_account: '123' as DeepPartial<BankAccountSchema>,
      });
    }).toThrow(
      'It is mandatory to inform the balance to create a transaction.',
    );
  });

  it('should return error if bank account balance is not reported', () => {
    expect(() => {
      new Transaction({
        amount: 0,
        type: TransactionTypes.CREDIT,
        bank_account: '123' as DeepPartial<BankAccountSchema>,
      });
    }).toThrow(
      'It is mandatory to inform the balance to create a transaction.',
    );
  });

  it('should return an error when the transaction is of the CREDIT type and the bank balance is insufficient', () => {
    expect(() => {
      new Transaction(
        {
          amount: 100,
          type: TransactionTypes.CREDIT,
          bank_account: '123' as DeepPartial<BankAccountSchema>,
        },
        0,
      );
    }).toThrow('Insufficient bank balance.');
  });
});
