import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('BankAccountsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/bank-accounts (POST)', () => {
    return request(app.getHttpServer())
      .post('/bank-accounts')
      .send({
        account_number: '111',
      })
      .expect(201);
  });

  it('/bank-accounts (POST)', () => {
    return request(app.getHttpServer())
      .post('/bank-accounts/transfer')
      .send({
        from: '444',
        to: '222',
        amount: 100,
      })
      .expect(200);
  });
});
