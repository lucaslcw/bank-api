import { IsNumber, IsString } from 'class-validator';

export class TransferDto {
  @IsString()
  source_bank_account_id: string;

  @IsString()
  destination_bank_account_id: string;

  @IsNumber()
  amount: number;
}
