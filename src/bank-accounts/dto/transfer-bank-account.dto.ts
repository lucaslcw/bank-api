import { IsNumber, IsString } from 'class-validator';

export class TransferBankAccountDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsNumber()
  amount: number;
}
