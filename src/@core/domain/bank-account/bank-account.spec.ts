import { BankAccount } from './bank-account';

describe('BankAccount', () => {
  it('should create a bank account', () => {
    const bankAccount = new BankAccount(
      {
        account_number: '1111-11',
        balance: 100,
      },
      '123',
    );
    expect(bankAccount.id).toBe('123');
    expect(bankAccount.balance).toBe(100);
    expect(bankAccount.account_number).toBe('1111-11');
  });

  it('should debit an account', () => {
    const bankAccount = new BankAccount({
      account_number: '1111-11',
      balance: 100,
    });
    bankAccount.debit(50);
    expect(bankAccount.balance).toBe(50);
  });

  it('should credit an account', () => {
    const bankAccount = new BankAccount({
      account_number: '1111-11',
      balance: 100,
    });
    bankAccount.credit(50);
    expect(bankAccount.balance).toBe(150);
  });
});
