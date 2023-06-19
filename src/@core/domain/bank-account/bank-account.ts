import * as crypto from 'crypto';

type BankAccountProps = {
  balance: number;
  account_number: string;
};

export class BankAccount {
  readonly id: string;

  constructor(public readonly props: BankAccountProps, id?: string) {
    this.id = id ?? crypto.randomUUID();
  }

  debit(amount: number): void {
    this.balance -= amount;
  }

  credit(amount: number): void {
    this.balance += amount;
  }

  get balance(): number {
    return this.props.balance;
  }

  private set balance(value: number) {
    this.props.balance = value;
  }

  get account_number(): string {
    return this.props.account_number;
  }

  private set account_number(value: string) {
    this.props.account_number = value;
  }
}
