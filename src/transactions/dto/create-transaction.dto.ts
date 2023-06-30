import { IsNumber, IsString } from 'class-validator';
import { TransactionTypes } from '../../@core/domain/transaction/transaction';

export class CreateTransactionDto {
  @IsString()
  bank_account_id: string;

  @IsString()
  type: TransactionTypes;

  @IsNumber()
  amount: number;
}
