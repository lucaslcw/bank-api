import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { BankAccountService } from '../@core/domain/bank-account/bank-account.service';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @HttpCode(201)
  @Post()
  async create(@Body() createBankAccountDto: CreateBankAccountDto) {
    return await this.bankAccountService.create(
      createBankAccountDto.account_number,
    );
  }
}
