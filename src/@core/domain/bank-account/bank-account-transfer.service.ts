import { BankAccount } from './bank-account';

export class BankAccountTransferService {
  async transfer(
    bankAccountSource: BankAccount,
    bankAccountDestination: BankAccount,
    amount: number,
  ) {
    bankAccountSource.debit(amount);
    bankAccountDestination.credit(amount);
  }
}
