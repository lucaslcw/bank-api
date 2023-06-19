import { BankAccount } from './bank-account';
import { BankAccountTransferService } from './bank-account-transfer.service';

describe('BankAccountTransfer', () => {
  let service: BankAccountTransferService;

  beforeEach(async () => {
    service = new BankAccountTransferService();
  });

  it('should transfer an amount between the source account to destination account', () => {
    const bankAccountSource = new BankAccount({
      account_number: '1111-11',
      balance: 100,
    });
    const bankAccountDestination = new BankAccount({
      account_number: '1111-11',
      balance: 100,
    });
    service.transfer(bankAccountSource, bankAccountDestination, 100);
    expect(bankAccountSource.balance).toBe(0);
    expect(bankAccountDestination.balance).toBe(200);
  });
});
