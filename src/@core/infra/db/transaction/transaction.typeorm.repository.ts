import { Repository } from 'typeorm';

import {
  Transaction,
  TransactionTypes,
} from '../../../domain/transaction/transaction';
import { TransactionRepository } from '../../../domain/transaction/transaction.repository';
import { TransactionSchema } from './transaction.schema';

export class TransactionTypeOrmRepository implements TransactionRepository {
  constructor(private readonly ormRepository: Repository<TransactionSchema>) {}

  async insert(transaction: Transaction): Promise<void> {
    const model = this.ormRepository.create(transaction);
    await this.ormRepository.insert(model);
  }

  async findAllByBankAccountId(
    bank_account_id: string,
  ): Promise<TransactionSchema[]> {
    const model = this.ormRepository.find({
      where: { bank_account: { id: bank_account_id } },
      order: {
        created_at: 'DESC',
      },
    });
    return model;
  }

  async calculateBankAccountBalance(bank_account_id: string): Promise<number> {
    const result = await this.ormRepository
      .createQueryBuilder('transaction')
      .where('transaction.bank_account = :id', { id: bank_account_id })
      .select(
        `SUM(CASE WHEN type = '${TransactionTypes.DEBIT}' THEN amount ELSE -amount END)`,
        'balance',
      )
      .getRawMany();
    return result[0].balance ?? 0;
  }

  async transfer(
    source_transaction: Transaction,
    destination_transaction: Transaction,
  ) {
    await this.ormRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const sourceTransactionModel = transactionalEntityManager.create(
          TransactionSchema,
          source_transaction,
        );
        const destinationTransactionModel = transactionalEntityManager.create(
          TransactionSchema,
          destination_transaction,
        );
        await transactionalEntityManager.save(sourceTransactionModel);
        await transactionalEntityManager.save(destinationTransactionModel);
      },
    );
  }
}
