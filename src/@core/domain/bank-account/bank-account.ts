import * as crypto from 'crypto';

type BankAccountProps = {
  account_number: string;
};

export class BankAccount {
  readonly id: string;

  constructor(public readonly props: BankAccountProps, id?: string) {
    this.id = id ?? crypto.randomUUID();
  }

  get account_number(): string {
    return this.props.account_number;
  }

  private set account_number(value: string) {
    this.props.account_number = value;
  }
}
