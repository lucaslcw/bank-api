import { IsString } from 'class-validator';

export class CreateBankAccountDto {
  @IsString()
  account_number: string;
}
