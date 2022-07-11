<p align="center">
  <h3 align="center">
    VALEX
  </h3>
</p>

## Usage

```bash
$ git clone https://github.com/rafaelongo45/valex

$ cd $valex

$ npm install

$ npm run dev
```

API:

```
- POST /card/create
    - Rota para criar um cartão para um funcionário
    - headers: { key: companyApiKey }
    - body: {
        "employeeId": employeeId,
        "type": "cardType"
}
- POST /card/activation/:id
    - Rota para ativar um cartão
    - headers: {}
    - body: {
        "securityCode": securityCode,
        "password": password
    }
- GET /card/info/:id
    - Rota para pegar as informações de um cartão por id
    - headers: {}
    - body: {}
- POST /card/block/:id
    - Rota para bloquear um cartão por id
    - headers: {}
    - body: {
        "password": password
    }
- POST /card/unblock/:id
    - Rota para desbloquear um cartão por id
    - headers: {}
    - body: {
        "password": password
    }
- POST /purchase/:businessId
    - Rota para fazer uma compra em um estabelecimento
    - headers: {}
    - body: {
        "cardId": 83,
        "password": 1234,
        "amount": 1
    }
- POST /purchase/online/:businessId
    - Rota para fazer uma compra online em um estabelecimento
    - headers: {}
    - body: {
        "number": "cardNumber",
        "name": "cardholderName",
        "expirationDate": "cardExpirationDate",
        "password": password,
        "securityCode": securityCode,
        "amount": purchaseValue
    }
- POST /recharge/:id 
    - Rota para desbloquear um cartão por id
    - headers: { key: companyApiKey }
    - body: {
        "amount": rechargeAmount
    }
```
