import { BankAccount } from './bank-account';

describe('BankAccountEntity', () => {
  it('should create a bank account', () => {
    const bankAccount = new BankAccount(
      {
        account_number: '1111-11',
      },
      '123',
    );
    expect(bankAccount.id).toBe('123');
    expect(bankAccount.account_number).toBe('1111-11');
  });
});
