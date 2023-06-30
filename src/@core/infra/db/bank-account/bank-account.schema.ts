import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionSchema } from '../transaction/transaction.schema';

@Entity()
export class BankAccountSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  account_number: string;

  @OneToMany(() => TransactionSchema, (transaction) => transaction.bank_account)
  transactions: TransactionSchema[];
}
