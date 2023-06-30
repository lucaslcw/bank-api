import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { TransactionService } from '../@core/domain/transaction/transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionService) {}

  @HttpCode(200)
  @Get('extract/:bank_account_id')
  async getExtract(@Param('bank_account_id') bank_account_id: string) {
    return await this.transactionService.getExtract(bank_account_id);
  }

  @HttpCode(200)
  @Get('balance/:bank_account_id')
  async getBankAccountBalance(
    @Param('bank_account_id') bank_account_id: string,
  ) {
    return await this.transactionService.getBankAccountBalance(bank_account_id);
  }

  @HttpCode(201)
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionService.create(
      createTransactionDto.bank_account_id,
      createTransactionDto.type,
      createTransactionDto.amount,
    );
  }

  @HttpCode(201)
  @Post('transfer')
  async transfer(@Body() transferDto: TransferDto) {
    return await this.transactionService.transfer(
      transferDto.source_bank_account_id,
      transferDto.destination_bank_account_id,
      transferDto.amount,
    );
  }
}
