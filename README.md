# REST API banking 🏦

This is a simple API with banking operations, such as creating a bank account, transferring between 2 accounts and calculating the balance. This API was developed with [NestJS](https://docs.nestjs.com/), [SQLite](https://www.sqlite.org/index.html) and [Jest](https://jestjs.io/pt-BR/).

## Install

      git clone https://github.com/lucaslcw/bank-api.git && npm install

## Run the api

      npm run start

## Run the tests

      npm run test

# REST API

All api routes are described below.

## Create bank account

### Request

`POST bank-accounts`

    curl -i -H 'Accept: application/json' http://localhost:3000/bank-accounts -d '{"account_number":":0000-00"}'

### Response

    HTTP/1.1 201 CREATED
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 CREATED
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    {
      "id": "c2c51654-1d06-4ee1-ac4f-599d6e81c592",
      "account_number": "0000-00",
      "created_at": "2011-10-05T14:48:00.000Z",
      "updated_at": "2011-10-05T14:48:00.000Z"
    }

## Get extract

### Request

`GET transactions/extract/:bank_account_id`

    curl -i -H 'Accept: application/json' http://localhost:3000/transactions/extract/:bank_account_id

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    [
      {
        "id": "c2c51654-1d06-4ee1-ac4f-599d6e81c592",
        "type": "DEBIT",
        "amount": 10,
        "bank_account": {
          "id": "7fff3d66-1735-11ee-be56-0242ac120002"
        },
        "created_at": "2011-10-05T14:48:00.000Z",
        "updated_at": "2011-10-05T14:48:00.000Z"
      }
    ]

## Get balance

### Request

`GET transactions/balance/:bank_account_id`

    curl -i -H 'Accept: application/json' http://localhost:3000/transactions/balance/:bank_account_id

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    10

## Create transaction

### Request

`POST transactions`

    curl -i -H 'Accept: application/json' http://localhost:3000/transactions -d '{"bank_account_id":":bank_account_id","type":"DEBIT","amount":10}'

### Response

    HTTP/1.1 201 CREATED
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 CREATED
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    {
      "id": "c2c51654-1d06-4ee1-ac4f-599d6e81c592",
      "type": "DEBIT",
      "amount": 10,
      "bank_account": {
        "id": "7fff3d66-1735-11ee-be56-0242ac120002"
      },
      "created_at": "2011-10-05T14:48:00.000Z",
      "updated_at": "2011-10-05T14:48:00.000Z"
    }

## Transfer between bank accounts

### Request

`POST transactions/transfer`

    curl -i -H 'Accept: application/json' http://localhost:3000/transactions/transfer -d '{"source_bank_account_id":":source_bank_account_id","destination_bank_account_id":":destination_bank_account_id","amount":10}'

### Response

    HTTP/1.1 201 CREATED
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 CREATED
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    
