import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { BankAccountService } from '../@core/domain/bank-account/bank-account.service';
import { TransferBankAccountDto } from './dto/transfer-bank-account.dto';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  async create(@Body() createBankAccountDto: CreateBankAccountDto) {
    return await this.bankAccountService.create(
      createBankAccountDto.account_number,
    );
  }

  @HttpCode(204)
  @Post('transfer')
  transfer(@Body() transferBankAccountDto: TransferBankAccountDto) {
    return this.bankAccountService.transfer(
      transferBankAccountDto.from,
      transferBankAccountDto.to,
      transferBankAccountDto.amount,
    );
  }
}
