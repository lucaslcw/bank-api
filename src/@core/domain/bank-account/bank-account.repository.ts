import { BankAccount } from './bank-account';

export interface BankAccountRepository {
  insert(bankAccount: BankAccount): Promise<void>;
  findById(id: string): Promise<BankAccount>;
}
