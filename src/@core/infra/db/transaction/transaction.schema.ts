import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BankAccountSchema } from '../bank-account/bank-account.schema';

@Entity()
export class TransactionSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  type: string;

  @Column({ type: 'decimal', scale: 2 })
  amount: number;

  @ManyToOne(
    () => BankAccountSchema,
    (bankAccountSchema) => bankAccountSchema.transactions,
    {
      cascade: true,
      nullable: false,
    },
  )
  bank_account: BankAccountSchema;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
