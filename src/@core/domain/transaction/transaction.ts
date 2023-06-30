import * as crypto from 'crypto';
import { BankAccountSchema } from '../../infra/db/bank-account/bank-account.schema';
import { DeepPartial } from 'typeorm';

export enum TransactionTypes {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

type TransactionProps = {
  type: TransactionTypes;
  amount: number;
  bank_account: DeepPartial<BankAccountSchema>;
};

export class Transaction {
  readonly id: string;

  constructor(
    private readonly props: TransactionProps,
    balance?: number,
    id?: string,
  ) {
    this.typeBusinessRule(props.type);
    this.amountBusinessRule(props.amount, balance);
    this.id = id ?? crypto.randomUUID();
  }

  get type(): TransactionTypes {
    return this.props.type;
  }

  private set type(value: TransactionTypes) {
    this.type = value;
  }

  get amount(): number {
    return this.props.amount;
  }

  private set amount(value: number) {
    this.amount = value;
  }

  get bank_account(): DeepPartial<BankAccountSchema> {
    return this.props.bank_account;
  }

  private set bank_account(value: DeepPartial<BankAccountSchema>) {
    this.bank_account = value;
  }

  private typeBusinessRule(type: TransactionTypes) {
    if (!Object.values(TransactionTypes).includes(type)) {
      throw new Error('Operation not allowed.');
    }
  }

  private amountBusinessRule(amount: number, balance: number) {
    if (balance === undefined || isNaN(balance)) {
      throw new Error(
        'It is mandatory to inform the balance to create a transaction.',
      );
    }
    if (amount <= 0) {
      throw new Error('Unable to generate a transaction with value 0.');
    }
    if (this.type === TransactionTypes.CREDIT && balance - amount < 0) {
      throw new Error('Insufficient bank balance.');
    }
  }
}
