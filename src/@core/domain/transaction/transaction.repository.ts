import { TransactionSchema } from '../../../@core/infra/db/transaction/transaction.schema';
import { Transaction } from './transaction';

export interface TransactionRepository {
  insert(transaction: Transaction): Promise<void>;
  findAllByBankAccountId(bank_account_id: string): Promise<TransactionSchema[]>;
  calculateBankAccountBalance(bank_account_id: string): Promise<number>;
  transfer(
    source_transaction: Transaction,
    destination_transaction: Transaction,
  ): Promise<void>;
}
