import { TransactionRepository } from './transaction.repository';
import { Transaction, TransactionTypes } from './transaction';
import { BankAccountRepository } from '../bank-account/bank-account.repository';

export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly bankAccountRepository: BankAccountRepository,
  ) {}

  async getExtract(bank_account_id: string) {
    const bankAccount = await this.bankAccountRepository.findById(
      bank_account_id,
    );
    return this.transactionRepository.findAllByBankAccountId(bankAccount.id);
  }

  async create(
    bank_account_id: string,
    type: TransactionTypes,
    amount: number,
  ) {
    const bankAccount = await this.bankAccountRepository.findById(
      bank_account_id,
    );
    const balance =
      await this.transactionRepository.calculateBankAccountBalance(
        bankAccount.id,
      );
    const transaction = new Transaction(
      { amount, bank_account: bankAccount, type },
      balance,
    );
    await this.transactionRepository.insert(transaction);
    return transaction;
  }

  async getBankAccountBalance(bank_account_id: string) {
    const bankAccount = await this.bankAccountRepository.findById(
      bank_account_id,
    );
    return this.transactionRepository.calculateBankAccountBalance(
      bankAccount.id,
    );
  }

  async transfer(
    source_bank_account_id: string,
    destination_bank_account_id: string,
    amount: number,
  ) {
    const sourceBankAccount = await this.bankAccountRepository.findById(
      source_bank_account_id,
    );
    const destinationBankAccount = await this.bankAccountRepository.findById(
      destination_bank_account_id,
    );
    const sourceBankAccountBalance =
      await this.transactionRepository.calculateBankAccountBalance(
        sourceBankAccount.id,
      );
    const destinationBankAccountBalance =
      await this.transactionRepository.calculateBankAccountBalance(
        destinationBankAccount.id,
      );
    const sourceTransaction = new Transaction(
      {
        amount,
        bank_account: sourceBankAccount,
        type: TransactionTypes.CREDIT,
      },
      sourceBankAccountBalance,
    );
    const destinationTransaction = new Transaction(
      {
        amount,
        bank_account: destinationBankAccount,
        type: TransactionTypes.DEBIT,
      },
      destinationBankAccountBalance,
    );
    await this.transactionRepository.transfer(
      sourceTransaction,
      destinationTransaction,
    );
  }
}
