
# Examples of XEL API calls are collected on this page .

[Description in here](Description.md)

-----------------
#  1 Account Operations
-----------------
### 1.1 Get Account

* Request:

```
http://localhost:17876/nxt?requestType=getAccount&account=XEL-MAYC-ZZ3Y-YX56-6NH52
```

* Response:

```
{
  "unconfirmedBalanceNQT":"102294500000",
  "accountRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
  "name":"suit&tie",
  "description":"",
  "forgedBalanceNQT":"0",
  "balanceNQT":"102294500000",
  "publicKey":"7a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0f",
  "requestProcessingTime":0,
  "account":"4615614572465333194"
}
```
---------------------
### 1.2 Get Account Block Count

* Request:

```
http://localhost:17876/nxt?requestType=getAccountBlockCount&account=XEL-MAYC-ZZ3Y-YX56-6NH52
```

* Response:

```
{
 "numberOfBlocks": 15,
 "requestProcessingTime": 0
}
```
--------------------
### 1.3 Get Account Block Ids

* Request:

```
http://localhost:17876/nxt?requestType=getAccountBlockIds&account=XEL-MAYC-ZZ3Y-YX56-6NH52&lastIndex=5
```

* Response:

```
{
  "blockIds": [
  "7680869603172255609",
  "7682558649963079901",
  "16974898634764546865",
  "15069071693196283391",
  "3356063095937102250",
  "13551173231193744250"
  ],
  "requestProcessingTime":1
}
```
---------------------
### 1.4 Get Account Blocks

* Request:

```
http://localhost:17876/nxt?requestType=getAccountBlocks&account=XEL-MAYC-ZZ3Y-YX56-6NH52&lastIndex=0
```

* Response:

```
{
  "blocks": [{
    "previousBlockHash":"aa0e93933d9e3ad97035be675cc858d539f246b65bacff932c79aff02ae2241e",
     "payloadLength":0,
     "totalAmountNQT":"0",
     "generationSignature":"1137c21b043f0200420bbd7501fdfc0d48e7f663d4c8f7a77d9e8e42b15df153",
     "generator":"4615614572465333194",
     "generatorPublicKey":"7a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0f",
     "baseTarget":"76861433500",
     "payloadHash":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
     "generatorRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
     "nextBlock":"15358836697085547811",
     "numberOfTransactions":0,
     "blockSignature":"e20d67df61f982b93d6146c3ed498c5951ff15aaee6cb0a9adff60263423b2020b200faa925aa8125fab79a9613a93ad8f52d1e7e19b7756dc460a80b51e8c7c",
     "transactions":[],
     "version":3,
     "totalFeeNQT":"0",
     "previousBlock":"15652997442185662122",
     "cumulativeDifficulty":"266185529964185",
     "block":"7680869603172255609",
     "height":428147,
     "timestamp":156584384
  }],
     "requestProcessingTime":0
}
```
-------------------
### 1.5 Get Account Id

* Request:

```
http://localhost:17876/nxt?requestType=getAccountId&secretPhrase=NoOneWillKnowIt
```

* Response:

```
{
  "accountRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
  "publicKey":"7a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0f",
  "requestProcessingTime":0,
  "account":"4615614572465333194"
}
```
-------------------
### 1.6 Get Account Ledger

* Request:

```
http://localhost:17876/nxt?requestType=getAccountLedger&account=XEL-MAYC-ZZ3Y-YX56-6NH52
```

* Response:

```
{
  "entries": [{
    "ledgerId":"73225",
    "isTransactionEvent":true,
    "balance":"102294500000",
    "accountRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
    "change":"-100000000",
    "block":"17409100738749748830",
    "eventType":"ORDINARY_PAYMENT",
    "event":"13374036681252280873",
    "account":"4615614572465333194",
    "height":428512,
    "timestamp":156645667
  },
  {
    "ledgerId":"73224",
    "isTransactionEvent":true,
    "balance":"102394500000",
    "accountRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
    "change":"-10000000",
    "block":"17409100738749748830",
    "eventType":"TRANSACTION_FEE",
    "event":"13374036681252280873",
    "account":"4615614572465333194",
    "height":428512,
    "timestamp":156645667
  }],
  "requestProcessingTime":0
}
```
-------------------
### 1.7 Get Account Ledger Entry

* Request:

```
http://localhost:17876/nxt?requestType=getAccountLedgerEntry&ledgerId=73224
```

* Response:

```
{
  "ledgerId":"73224",
  "isTransactionEvent":true,
  "balance":"102394500000",
  "accountRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
  "change":"-10000000",
  "block":"17409100738749748830",
  "eventType":"TRANSACTION_FEE",
  "requestProcessingTime":1,
  "event":"13374036681252280873",
  "account":"4615614572465333194",
  "height":428512,
  "timestamp":156645667
}
```
-------------------
### 1.8  Get Account Public Key

* Request:

```
http://localhost:17876/nxt?requestType=getAccountPublicKey&account=XEL-MAYC-ZZ3Y-YX56-6NH52
```

* Response:

```
{
  "publicKey":"7a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0f",
  "requestProcessingTime":0
}
```
-------------------
### 1.9  Get Balance

* Request:

```
http://localhost:17876/nxt?requestType=getBalance&account=XEL-MAYC-ZZ3Y-YX56-6NH52
```

* Response:

```
{
  "unconfirmedBalanceNQT":"102294500000",
  "forgedBalanceNQT":"0",
  "balanceNQT":"102294500000",
  "requestProcessingTime":0
}
```
-------------------
### 1.10 Get Blockchain Transactions

* Request:

```
http://localhost:17876/nxt?requestType=getBlockchainTransactions&account=XEL-MAYC-ZZ3Y-YX56-6NH52&lastIndex=0
```

* Response:

```
{
  "requestProcessingTime":1,
  "transactions": [{
    "signatureValid":true,
    "signature":"7c8785be8e150217a54ca9f9f094a6e116086aa0f0e3b77be6358020a2af970957f022b881506ad50a0b1752a98d4213303caf968d05140e896571aa222add94",
    "transactionIndex":0,
    "type":0,
    "phased":false,
    "ecBlockId":"13769421951337852026",
    "signatureHash":"c2577e60e7cecd7a5645adac3e3ead6e881da1a0b797ce0fb542b1c3265f5b36",
    "attachment":
      {
        "version.OrdinaryPayment":0,
        "version.PublicKeyAnnouncement":1,
        "recipientPublicKey":"f52e0be999c198acdb8872fdc29a67a69fae815d074d8082ac7878bf0e8ecc14"
      },
    "senderRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
    "subtype":0,
    "amountNQT":"100000000",
    "recipientRS":"XEL-KK4R-MVBN-YP4E-9Q49K",
    "block":"17409100738749748830",
    "blockTimestamp":156645667,
    "deadline":1440,
    "timestamp":156645677,
    "height":428512,
    "senderPublicKey":"7a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0f",
    "feeNQT":"10000000",
    "confirmations":1573,
    "fullHash":"291a16bf801f9ab92d546383afc153b7e6c6d66494a1d97c6f089e83b6c25cc8",
    "version":1,
    "sender":"4615614572465333194",
    "recipient":"8690916621067797591",
    "ecBlockHeight":0,
    "transaction":"13374036681252280873"
    }]
 }
```
-------------------
### 1.11 Get Guaranteed Balance

* Request:

```
http://localhost:17876/nxt?requestType=getGuaranteedBalance&account=XEL-MAYC-ZZ3Y-YX56-6NH52&numberOfConfirmations=1440
```

* Response:

```
{
  "guaranteedBalanceNQT":"102294500000",
  "requestProcessingTime":48
}
```
-------------------
### 1.12 Get Unconfirmed Transaction Ids

* Request:

```
http://localhost:17876/nxt?requestType=getUnconfirmedTransactionIds&account=XEL-MAYC-ZZ3Y-YX56-6NH52
```

* Response:

```
{
  "requestProcessingTime":0,
  "unconfirmedTransactionIds":[]
}
```
-------------------
### 1.13 Get Unconfirmed Transactions

* Request:

```
http://localhost:17876/nxt?requestType=getUnconfirmedTransactions&account=XEL-MAYC-ZZ3Y-YX56-6NH52
```

* Response:

```
{
  "unconfirmedTransactions":[],
  "requestProcessingTime":0
}
```
-------------------
### 1.14 Search Accounts

* Request:

```
http://localhost:17876/nxt?requestType=searchAccounts&query=suit&tie
```

* Response:

```
{
  "accounts": [{
    "accountRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
    "name":"suit&tie",
    "account":"4615614572465333194"
    }],
    "requestProcessingTime":53
}
```
-------------------
### 1.15 Send XEL

* Request:

```
http://localhost:17876/nxt?requestType=sendMoney&secretPhrase=NoOneWillKnowIt&recipient=XEL-6UZD-5ZNQ-CECA-8EAWR&amountNQT=10000000&feeNQT=10000000&deadline=60
```

* Response:

```
{
  "signatureHash":"30441dc0ecddcf295e3c892b5884c458620e48f509656958523210c4c25a37fe",
  "transactionJSON":
  {
    "senderPublicKey":"7a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0f",
    "signatureValid":true,
    "signature":"ade73ebfc5283e2cacadeb5ea4c3e6a4373462015e3d33f6329e6edaabeacb08d617f2ccff683961cfc3bd2a9b69ee7090719ed04d4a4857959b3db4d21f1ab0",
    "feeNQT":"10000000",
    "type":0,
    "fullHash":"b4caa34242a5cf6a9182f26cacdc13d3f72f2f585c9893da45d5a5d557a9df41",
    "version":1,
    "phased":false,
    "ecBlockId":"6646603570652606797",
    "signatureHash":"30441dc0ecddcf295e3c892b5884c458620e48f509656958523210c4c25a37fe",
    "attachment":{"version.OrdinaryPayment":0},
    "senderRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
    "subtype":0,
    "amountNQT":"10000000",
    "sender":"4615614572465333194",
    "recipientRS":"XEL-6UZD-5ZNQ-CECA-8EAWR",
    "recipient":"7778011362644618219",
    "ecBlockHeight":429371,
    "deadline":60,
    "transaction":"7696551992203922100",
    "timestamp":156912185,
    "height":2147483647
    },
  "unsignedTransactionBytes":"0010394a5a093c007a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0feb6b62e91f0cf16b80969800000000008096980000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003b8d06004d719777bb7a3d5c",
  "broadcasted":true,
  "requestProcessingTime":2,
  "transactionBytes":"0010394a5a093c007a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0feb6b62e91f0cf16b809698000000000080969800000000000000000000000000000000000000000000000000000000000000000000000000ade73ebfc5283e2cacadeb5ea4c3e6a4373462015e3d33f6329e6edaabeacb08d617f2ccff683961cfc3bd2a9b69ee7090719ed04d4a4857959b3db4d21f1ab0000000003b8d06004d719777bb7a3d5c",
  "fullHash":"b4caa34242a5cf6a9182f26cacdc13d3f72f2f585c9893da45d5a5d557a9df41",
  "transaction":"7696551992203922100"
}
```
-------------------
# 2 Message System Operations
-------------------
### 2.1 Decrypt From

* Request:

```
http://localhost:7876/nxt?requestType=decryptFrom&secretPhrase=IWontTellYou&account=XEL-MAYC-ZZ3Y-YX56-6NH52&data=5c30bd27cc86a8ab0349aaf66deae3c0a9db5675b5c4ba973dd47f37e06157...&nonce=7f3c9082c73a7bd825aa48d23fc138fd05a466700ff9fc3a040bbb29d3a60ee1&
```

* Response:

```
{
 "decryptedMessage": "test message",
 "requestProcessingTime": 2
}
```
-------------------
### 2.2 Download Prunable Message

* Request:

```
http://localhost:7876/nxt?requestType=downloadPrunableMessage&transaction=264609232955144528&retrieve=true
```

* Response:

```
The file in binary format.
```
-------------------
### 2.3 Encrypt To

* Request:

```
http://localhost:7876/nxt?requestType=encryptTo&secretPhrase=IWontTellYou&recipient=XEL-MAYC-ZZ3Y-YX56-6NH52&messageToEncrypt=test message&
```

* Response:

```
{
 "data": "5c30bd27cc86a8ab0349aaf66deae3c0a9db5675b5c4ba973dd47f37e06157...",
 "requestProcessingTime": 48,
 "nonce": "7f3c9082c73a7bd825aa48d23fc138fd05a466700ff9fc3a040bbb29d3a60ee1"
}
```
-------------------
### 2.4 Get All Prunable Messages

* Request:

```
http://localhost:17876/nxt?requestType=getAllPrunableMessages&lastIndex=0
```

* Response:

```
{
 "prunableMessages": [
  {
   "senderRS": "XEL-MAYC-ZZ3Y-YX56-6NH52",
   "sender": "15295723609781267838",
   "recipientRS": "XEL-6UZD-5ZNQ-CECA-8EAWR",
   "recipient": "11580081983047651163",
   "blockTimestamp": 46382992,
   "message": "This is a test prunable plain message.",
   "transaction": "4628485271017409467",
   "isText": true,
   "transactionTimestamp": 46382948
  }
 ],
 "requestProcessingTime": 0
}
```
-------------------
### 2.5 Get Prunable Message

* Request:

```
http://localhost:17876/nxt?requestType=getPrunableMessage&transaction=16832262845403902696&secretPhrase=secretPhrase
```

* Response:

```
{
 "senderRS": "XEL-MAYC-ZZ3Y-YX56-6NH52",
 "encryptedMessage": {
  "data": "ba6baa8361ac5bdb9cb591cee616dc5801a32ddf05b66a4ee527cd8d57b0...",
  "nonce": "41f93e32997c70937a005e5b0b42546a1efa9ea9eb012f98d7a92d0c5a8855a4"
 },
 "sender": "15295723609781267838",
 "decryptedMessage": "test prunable encrypted message",
 "recipientRS": "XEL-6UZD-5ZNQ-CECA-8EAWR",
 "recipient": "11580081983047651163",
 "blockTimestamp": 46117919,
 "requestProcessingTime": 3,
 "transaction": "16832262845403902696",
 "encryptedMessageIsText": true,
 "transactionTimestamp": 46117594,
 "isCompressed": true
}
```
-------------------
### 2.6 Get Prunable Messages

* Request:

```
http://localhost:17876nxt?requestType=getPrunableMessages&account=XEL-MAYC-ZZ3Y-YX56-6NH52&lastIndex=0
```

* Response:

```
{
 "prunableMessages": [
  {
   "senderRS": "XEL-MAYC-ZZ3Y-YX56-6NH52",
   "encryptedMessage": {
    "data": "ba6baa8361ac5bdb9cb591cee616dc5801a32ddf05b66a4ee527cd8d57b0a...",
    "nonce": "41f93e32997c70937a005e5b0b42546a1efa9ea9eb012f98d7a92d0c5a8855a4"
   },
   "sender": "15295723609781267838",
   "recipientRS": "XEL-6UZD-5ZNQ-CECA-8EAWR",
   "recipient": "11580081983047651163",
   "blockTimestamp": 46117919,
   "transaction": "16832262845403902696",
   "isText": true,
   "transactionTimestamp": 46117594,
   "isCompressed": true
  }
 ],
 "requestProcessingTime": 1
}
```
-------------------
### 2.7  Get Shared Key

* Request:

```
http://localhost:17876/nxt?requestType=getSharedKey&account=XEL-MAYC-ZZ3Y-YX56-6NH52&secretPhrase=IWontTellYou&nonce=0102030405060708091011121314151617181920212223242526272829303132
```

* Response:

```
{
 "sharedKey": "927118faa4850afa7fb3ced7b17eb4968ec4f1c0a405b0890552bb54a67d0eba",
 "requestProcessingTime": 1
}
```
-------------------
### 2.8 Read Message

* Request:

```
http://localhost:17876nxt?requestType=readMessage&transaction=9908575668289607167&secretPhrase=IWontTellYou&
```

* Response:

```
{
 "requestProcessingTime": 1,
 "message": "Test message.",
 "decryptedMessage": "Test message (encrypted).",
 "decryptedMessageToSelf": "abc123"
}
```
-------------------
### 2.9 Send Message

* Request:

```
http://localhost:17876nxt?requestType=sendMessage&secretPhrase=IWontTellYou&recipient=XEL-MAYC-ZZ3Y-YX56-6NH52&message=Test Message.&deadline=60
```

* Response:

```
{
 "signatureHash": "795c58938a50d691f3f2b88bfaf03267236e972e1c068e0a5e11aeb606597f17",
 "unsignedTransactionBytes": "01100593ce013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c14...",
 "transactionJSON": {
  "senderPublicKey": "57fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143b473beec228f79ff93c",
  "signature": "e916dbbfec51ca97ae76b1b190d1c74328f74c3c43ed3a06f1ca0ea250116...",
  "feeNQT": "100000000",
  "type": 1,
  "fullHash": "ff157b8a125582898b5c50d32a62f725602d5197af236fabcd6ec978b6861528",
  "version": 1,
  "ecBlockId": "6060075251340574063",
  "signatureHash": "795c58938a50d691f3f2b88bfaf03267236e972e1c068e0a5e11aeb606597f17",
  "attachment": {
   "version.Message": 1,
   "messageIsText": true,
   "message": "Test message."
  },
  "senderRS": "XEL-MAYC-ZZ3Y-YX56-6NH52",
  "subtype": 0,
  "amountNQT": "0",
  "sender": "15323192282528158131",
  "recipientRS": "XEL-6UZD-5ZNQ-CECA-8EAWR",
  "recipient": "17013046603665206934",
  "ecBlockHeight": 280756,
  "deadline": 60,
  "transaction": "9908575668289607167",
  "timestamp": 30315269,
  "height": 2147483647
 },
 "broadcasted": true,
 "requestProcessingTime": 11379,
 "transactionBytes": "01100593ce013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143b...",
 "fullHash": "ff157b8a125582898b5c50d32a62f725602d5197af236fabcd6ec978b6861528",
 "transaction": "9908575668289607167"
}
```
-------------------
### 2.10 Verify Prunable Message

* Request:

```
http://localhost:17876nxt?requestType=verifyPrunableMessage&message=This is a test prunable plain message.
```

* Response:

```
{
 "version.PrunablePlainMessage": 1,
 "verify": true,
 "messageIsText": true,
 "messageHash": "da99da8026e30d971340ef54803543af3aa48ea215f80bd9375457bad8effb3f",
 "requestProcessingTime": 1,
 "message": "This is a test prunable plain message."
}
```
-------------------
# 3 Block Operations
-------------------
### 3.1 Get Block

* Request:

```
http://localhost:17876/nxt?requestType=getBlock&block=
```

* Response:

```
{
  "previousBlockHash":"3d600c3463b1780b63232db7df96d7fe0b5c2163782897582144f91887d76da7",
  "payloadLength":0,
  "totalAmountNQT":"0",
  "generationSignature":"a3ecd73ca4b31f0bd9e5d67a99e33feaf70d90c58f06b7f0d570c92db0cdb569",
  "generator":"7993521871267553027",
  "generatorPublicKey":"ce6e7e3149ea7db259004bf2d7a2502b36fdef9ad89f6087c4d213b8eb429709",
  "baseTarget":"76861433500",
  "payloadHash":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "generatorRS":"XEL-HRS5-TBEM-MJZQ-8KPVX",
  "requestProcessingTime":0,
  "numberOfTransactions":0,
  "blockSignature":"2944c51ffbb5766a9732b04b7f1e966d27b63644ea7eb7ba25ef08bd29b7940ed7c2739eb71f722bd88636cca4048fdedc4be22674200a916f2eb41b4904ace3",
  "transactions":[],
  "version":3,
  "totalFeeNQT":"0",
  "previousBlock":"826605571255590973",
  "cumulativeDifficulty":"266665795872105",
  "block":"17239645655093153265",
  "height":430137,
  "timestamp":156923950
}
```
-------------------
### 3.2 Get Block Id

* Request:

```
http://localhost:17876/nxt?requestType=getBlockId&height=0
```

* Response:

```
{
  "block":"13769421951337852026",
  "requestProcessingTime":0
}
```
-------------------
### 3.3  Get Blocks

* Request:

```
http://localhost:17876/nxt?requestType=getBlocks&lastIndex=1
```

* Response:

```
{
  "blocks": [{
    "previousBlockHash":"f10d6f3d62863fef15f18759db99f56a0753a3da269c1c924f5ab976ad74a25f",
    "payloadLength":0,
    "totalAmountNQT":"0",
    "generationSignature":"b16bc82463259a138e50c2b5c801a8c949c811a12bd501444569478537e41227",
    "generator":"447351889786866560",
    "generatorPublicKey":"e3f8731a68b9058bd0438f2febfea4211574aa03fc2ae32bd88cb72614038d03",
    "baseTarget":"76861433500",
    "payloadHash":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "generatorRS":"XEL-K4W2-7KS7-SUQS-2JCFE",
    "numberOfTransactions":0,
    "blockSignature":"d4c7392bcfaa34ee641eb398aeab16ea2a3f86ba305779cc977ceb465f72d704968b016ea3f1a4b97c90e8813777cfc412b2009e6b34fde413e049908ee8c12e",
    "transactions":[],
    "version":3,
    "totalFeeNQT":"0",
    "previousBlock":"17239645655093153265",
    "cumulativeDifficulty":"266666035872105",
    "block":"12734717765872825399",
    "height":430138,
    "timestamp":156924368
    },
    {
    "previousBlockHash":"3d600c3463b1780b63232db7df96d7fe0b5c2163782897582144f91887d76da7",
    "payloadLength":0,
    "totalAmountNQT":"0",
    "generationSignature":"a3ecd73ca4b31f0bd9e5d67a99e33feaf70d90c58f06b7f0d570c92db0cdb569",
    "generator":"7993521871267553027",
    "generatorPublicKey":"ce6e7e3149ea7db259004bf2d7a2502b36fdef9ad89f6087c4d213b8eb429709",
    "baseTarget":"76861433500",
    "payloadHash":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "generatorRS":"XEL-HRS5-TBEM-MJZQ-8KPVX",
    "nextBlock":"12734717765872825399",
    "numberOfTransactions":0,
    "blockSignature":"2944c51ffbb5766a9732b04b7f1e966d27b63644ea7eb7ba25ef08bd29b7940ed7c2739eb71f722bd88636cca4048fdedc4be22674200a916f2eb41b4904ace3",
    "transactions":[],
    "version":3,
    "totalFeeNQT":"0",
    "previousBlock":"826605571255590973",
    "cumulativeDifficulty":"266665795872105",
    "block":"17239645655093153265",
    "height":430137,
    "timestamp":156923950
    }],
  "requestProcessingTime":0
}
```
-------------------
### 3.4 Get EC Block

* Request:

```
http://localhost:17876/nxt?requestType=getECBlock
```

* Response:

```
{
  "ecBlockHeight":429418,
  "requestProcessingTime":0,
  "ecBlockId":"766921926984690852",
  "timestamp":156924738
}
```
-------------------
# 4  Forging Operations
-------------------
### 4.1 Start / Stop / Get Forging

* Request:

```
http://localhost:17876/nxt?requestType=startForging&secretPhrase=IWontTellYou
```

* Response:

```
{
 "requestProcessingTime": 1,
 "deadline": 0,
 "hitTime": 0
}
```
-------------------
### 4.2 Get Next Block Generators

* Request:

```
http://localhost:17876/nxt?requestType=getNextBlockGenerators&limit=3
```

* Response:

```
{
  "activeCount":23,
  "lastBlock":"9065353947068338212",
  "generators": [{
    "effectiveBalanceNXT":178678,
    "accountRS":"XEL-L5MV-DQ25-GCF4-DLA89",
    "deadline":97,
    "account":"12941395197018312315",
    "hitTime":156924918
    },
    {
    "effectiveBalanceNXT":200182,
    "accountRS":"XEL-HRS5-TBEM-MJZQ-8KPVX",
    "deadline":403,
    "account":"7993521871267553027",
    "hitTime":156925224
    },
    {
    "effectiveBalanceNXT":218849,
    "accountRS":"XEL-S9AT-KEC5-6UTS-EFLC8",
    "deadline":446,
    "account":"14063138046153071897",
    "hitTime":156925267
    }],
  "requestProcessingTime":0,
  "timestamp":156924821,
  "height":430139
}
```
-------------------
# 5  Phasing Operations
-------------------
### 5.1 Approve Transaction

* Request:

```
http://localhost:17876/nxt?requestType=approveTransaction&transactionFullHash=5016cc59b0665675f00513e8c647288e0a668a78c4964c84d0de8f768b89060a&revealedSecretText=secret&secretPhrase=secretPhrase&feeNQT=100000000&deadline=60
```

* Response:

```
{
 "signatureHash": "db429ccecd7d13b54b43cf9db7656cef6df6152c60e626b393000ed00a652c95",
 "transactionJSON": {
  "senderPublicKey": "10f09c34f225d425306e5be55a4946908156072afbead4d574a512d7e086ef5c",
  "signature": "380e1a94e40d58e9382aa742ca998373e27c5d30890d91a74d83bfead849e507e93c51...",
  "feeNQT": "100000000",
  "type": 1,
  "fullHash": "2bb80af156e70067f509df9ad5a88b687040cff4a8c778c69aef77863d3d15ef",
  "version": 1,
  "phased": false,
  "ecBlockId": "704052112466096836",
  "signatureHash": "db429ccecd7d13b54b43cf9db7656cef6df6152c60e626b393000ed00a652c95",
  "attachment": {
   "transactionFullHashes": [
    "5016cc59b0665675f00513e8c647288e0a668a78c4964c84d0de8f768b89060a"
   ],
   "version.PhasingVoteCasting": 1,
   "revealedSecret": "736563726574"
  },
  "senderRS": "XEL-MAYC-ZZ3Y-YX56-6NH52",
  "subtype": 9,
  "amountNQT": "0",
  "sender": "15295723609781267838",
  "ecBlockHeight": 262493,
  "deadline": 60,
  "transaction": "7422186546503792683",
  "timestamp": 43965004,
  "height": 2147483647
 },
 "unsignedTransactionBytes": "01194cda9e023c0010f09c34f225d425306e5be55a494690...",
 "broadcasted": true,
 "requestProcessingTime": 20,
 "transactionBytes": "01194cda9e023c0010f09c34f225d425306e5be55a4946908156072a...",
 "fullHash": "2bb80af156e70067f509df9ad5a88b687040cff4a8c778c69aef77863d3d15ef",
 "transaction": "7422186546503792683"
}
```
-------------------
# 6  Server Information Operations
-------------------

### 6.1 Get Blockchain Status

* Request:

```
http://localhost:17876/nxt?requestType=getBlockchainStatus
```

* Response:

```
{
  "apiProxy":false,
  "correctInvalidFees":false,
  "ledgerTrimKeep":30000,
  "maxAPIRecords":100,
  "blockchainState":"UP_TO_DATE",
  "currentMinRollbackHeight":0,
  "numberOfBlocks":430143,
  "isTestnet":false,
  "includeExpiredPrunable":true,
  "isLightClient":false,
  "services": [
    "PRUNABLE",
    "API",
    "API",
    "COMPUTATION_REDIRECTOR",
    "CORS"
    ],
  "requestProcessingTime":0,
  "version":"3.2.1",
  "maxRollback":800,
  "lastBlock":"5714258664044683038",
  "application":"XEL(Beta)",
  "isScanning":false,
  "isDownloading":false,
  "cumulativeDifficulty":"266666995872105",
  "lastBlockchainFeederHeight":430142,
  "maxPrunableLifetime":2147483647,
  "time":156926083,
  "lastBlockchainFeeder":"18.196.245.253"
}
```
-------------------
### 6.2 Get Constants

* Request:

```
http://localhost:17876/nxt?requestType=getConstants
```

* Response:

```
Please test it , as its to big to print it here .
```
-------------------
### 6.3 Get Plugins

* Request:

```
http://localhost:17876/nxt?requestType=getPlugins
```

* Response:

```
{
  "plugins":[],
  "requestProcessingTime":0
}
```
-------------------
### 6.4 Get State

* Request:

```
http://localhost:17876/nxt?requestType=getState
```

* Response:

```
{
  "numberOfPeers":36,
  "unconfirmedBalanceNQT":"0",
  "correctInvalidFees":false,
  "numberOfUnlockedAccounts":0,
  "ledgerTrimKeep":30000,
  "maxAPIRecords":100,
  "blockchainState":"UP_TO_DATE",
  "includeExpiredPrunable":true,
  "forgedBalanceNQT":"0",
  "balanceNQT":"0",
  "maxMemory":15015608320,
  "maxRollback":800,
  "isScanning":false,
  "isDownloading":false,
  "cumulativeDifficulty":"266667235872105",
  "lastBlockComputation":-786334673676426947,
  "freeMemory":861482408,
  "peerPort":17874,
  "apiProxy":false,
  "availableProcessors":16,
  "needsAdminPassword":true,
  "currentMinRollbackHeight":0,
  "numberOfBlocks":430144,
  "isTestnet":false,
  "isLightClient":false,
  "services": [
    "PRUNABLE",
    "API",
    "API",
    "COMPUTATION_REDIRECTOR",
    "CORS"
  ],
  "requestProcessingTime":0,
  "version":"3.2.1",
  "lastBlock":"16001059385779364314",
  "totalMemory":1458044928,
  "application":"XEL (Beta)",
  "numberOfActivePeers":7,
  "lastBlockchainFeederHeight":430143,
  "maxPrunableLifetime":2147483647,
  "isOffline":false,
  "time":156926468,
  "lastBlockchainFeeder":"52.59.53.204"
}
```
-------------------
### 6.5 Get Time

* Request:

```
http://localhost:17876/nxt?requestType=getTime
```

* Response:

```
{
  "time":156926706,
  "requestProcessingTime":0
}
```
-------------------
# 7  Transaction Operations
-------------------

### 7.1 Broadcast Transaction

* Request:

```
http://localhost:17876/nxt?requestType=broadcastTransaction&transactionBytes=001046aac6013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143...
```

* Response:

```
{
 "requestProcessingTime": 4,
 "fullHash": "3a304584f20cf3d2cbbdd9698ff9a166427005ab98fbe9ca4ad6253651ee81f1",
 "transaction": "15200507403046301754"
}
```
-------------------
### 7.2  Calculate Full Hash

* Request:

```
http://localhost:17876/nxt?requestType=calculateFullHash&unsignedTransactionBytes=001046aac6013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f2...&signatureHash=b35eae7d2f01639810d37694138aa0a86fbbf8a9bf58c2be4f2a5b8f0f30b3f7
```

* Response:

```
{
 "requestProcessingTime": 1,
 "fullHash": "3a304584f20cf3d2cbbdd9698ff9a166427005ab98fbe9ca4ad6253651ee81f1"
}
```
-------------------
### 7.3 Get Transaction

* Request:

```
http://localhost:17876/nxt?requestType=getTransaction&transaction=7696551992203922100
```

* Response:

```
{
  "signatureValid":true,
  "signature":"ade73ebfc5283e2cacadeb5ea4c3e6a4373462015e3d33f6329e6edaabeacb08d617f2ccff683961cfc3bd2a9b69ee7090719ed04d4a4857959b3db4d21f1ab0",
  "transactionIndex":0,
  "type":0,
  "phased":false,
  "ecBlockId":"6646603570652606797",
  "signatureHash":"30441dc0ecddcf295e3c892b5884c458620e48f509656958523210c4c25a37fe",
  "attachment":{"version.OrdinaryPayment":0},
  "senderRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
  "subtype":0,
  "amountNQT":"10000000",
  "recipientRS":"XEL-6UZD-5ZNQ-CECA-8EAWR",
  "block":"4540048566874738144",
  "blockTimestamp":156912484,
  "deadline":60,
  "timestamp":156912185,
  "height":430092,
  "senderPublicKey":"7a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0f",
  "feeNQT":"10000000",
  "requestProcessingTime":0,
  "confirmations":310,
  "fullHash":"b4caa34242a5cf6a9182f26cacdc13d3f72f2f585c9893da45d5a5d557a9df41",
  "version":1,
  "sender":"4615614572465333194",
  "recipient":"7778011362644618219",
  "ecBlockHeight":429371,
  "transaction":"7696551992203922100"
}
```
-------------------
### 7.4 Get Transaction Bytes

* Request:

```
http://localhost:17876/nxt?requestType=getTransactionBytes&transaction=7696551992203922100
```

* Response:

```
{
  "unsignedTransactionBytes":"0010394a5a093c007a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0feb6b62e91f0cf16b80969800000000008096980000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003b8d06004d719777bb7a3d5c",
  "requestProcessingTime":1,
  "confirmations":311,
  "transactionBytes":"0010394a5a093c007a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0feb6b62e91f0cf16b809698000000000080969800000000000000000000000000000000000000000000000000000000000000000000000000ade73ebfc5283e2cacadeb5ea4c3e6a4373462015e3d33f6329e6edaabeacb08d617f2ccff683961cfc3bd2a9b69ee7090719ed04d4a4857959b3db4d21f1ab0000000003b8d06004d719777bb7a3d5c"
}
```
-------------------
### 7.5 Parse Transaction

* Request:

```
http://localhost:17876/nxt?requestType=parseTransaction&transactionBytes=0010394a5a093c007a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0feb6b62e91f0cf16b80969800000000008096980000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003b8d06004d719777bb7a3d5c
```

* Response:

```
{
  "senderPublicKey":"7a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0f",
  "feeNQT":"10000000",
  "requestProcessingTime":0,
  "type":0,
  "version":1,
  "phased":false,
  "ecBlockId":"6646603570652606797",
  "attachment":{"version.OrdinaryPayment":0},
  "senderRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
  "subtype":0,
  "amountNQT":"10000000",
  "sender":"4615614572465333194"
  ,"recipientRS":"XEL-6UZD-5ZNQ-CECA-8EAWR",
  "recipient":"7778011362644618219",
  "ecBlockHeight":429371,
  "verify":false,
  "deadline":60,
  "timestamp":156912185,
  "height":2147483647
}
```
-------------------
### 7.6 Send Transaction

* Request:

```
http://localhost:17876/nxt?requestType=sendTransaction&transactionBytes=0010394a5a093c007a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0feb6b62e91f0cf16b809698000000000080969800000000000000000000000000000000000000000000000000000000000000000000000000ade73ebfc5283e2cacadeb5ea4c3e6a4373462015e3d33f6329e6edaabeacb08d617f2ccff683961cfc3bd2a9b69ee7090719ed04d4a4857959b3db4d21f1ab0000000003b8d06004d719777bb7a3d5c
```

* Response:

```
{
  "requestProcessingTime":0,
  "fullHash":"b4caa34242a5cf6a9182f26cacdc13d3f72f2f585c9893da45d5a5d557a9df41",
  "transaction":"7696551992203922100"
}
```
-------------------
### 7.7 Sign Transaction

* Request:

```
http://localhost:17876/nxt?requestType=signTransaction&unsignedTransactionBytes=0010394a5a093c007a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0feb6b62e91f0cf16b80969800000000008096980000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003b8d06004d719777bb7a3d5c&secretPhrase=NoOneWillKnowIt
```

* Response:

```
{
  "signatureHash":"30441dc0ecddcf295e3c892b5884c458620e48f509656958523210c4c25a37fe",
  "transactionJSON": {     
    "senderPublicKey":"7a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0f",
    "signatureValid":true,
    "signature":"ade73ebfc5283e2cacadeb5ea4c3e6a4373462015e3d33f6329e6edaabeacb08d617f2ccff683961cfc3bd2a9b69ee7090719ed04d4a4857959b3db4d21f1ab0",
    "feeNQT":"10000000",
    "type":0,
    "fullHash":"b4caa34242a5cf6a9182f26cacdc13d3f72f2f585c9893da45d5a5d557a9df41",
    "version":1,
    "phased":false,
    "ecBlockId":"6646603570652606797",
    "signatureHash":"30441dc0ecddcf295e3c892b5884c458620e48f509656958523210c4c25a37fe",
    "attachment":{"version.OrdinaryPayment":0},
    "senderRS":"XEL-MAYC-ZZ3Y-YX56-6NH52",
    "subtype":0,
    "amountNQT":"10000000",
    "sender":"4615614572465333194",
    "recipientRS":"XEL-6UZD-5ZNQ-CECA-8EAWR",
    "recipient":"7778011362644618219",
    "ecBlockHeight":429371,
    "deadline":60,
    "transaction":"7696551992203922100",
    "timestamp":156912185,
    "height":2147483647
    },
  "verify":true,
  "requestProcessingTime":0,
  "transactionBytes":"0010394a5a093c007a2e2e8ab3fbd88bebebf75ce613a59fad938696a0ee9ace31f90451a6d91f0feb6b62e91f0cf16b809698000000000080969800000000000000000000000000000000000000000000000000000000000000000000000000ade73ebfc5283e2cacadeb5ea4c3e6a4373462015e3d33f6329e6edaabeacb08d617f2ccff683961cfc3bd2a9b69ee7090719ed04d4a4857959b3db4d21f1ab0000000003b8d06004d719777bb7a3d5c",
  "fullHash":"b4caa34242a5cf6a9182f26cacdc13d3f72f2f585c9893da45d5a5d557a9df41",
  "transaction":"7696551992203922100"
}
```
-------------------
# 8  Token Operations
-------------------
### 8.1 Decode File Token

* Request:

```
http://localhost:17876/nxt?requestType=decodeFileToken&file=test.txt&token=u8q9ps0gdoo2bl158p4llpar583ld0cgejat9qnrgrgde4l5uscgan7fu25hi...
```
The request is shown above in URL format for consistency. The actual request must be an HTTP POST request with a multipart content type. For example, the corresponding cURL command is as follows:

```
curl -F requestType=generateFileToken -F file=@test.txt -F secretPhrase="secretPhrase" http://localhost:17876/nxt
```
* Response:

```
{
"valid": true,
"accountRS": "XEL-MAYC-ZZ3Y-YX56-6NH52",
"requestProcessingTime": 3,
"account": "15295723609781267838",
"timestamp": 49748229
}
```

-------------------
### 8.2 Decode Token

* Request:

```
http://localhost:17876/nxt?requestType=decodeToken&website=test&token=u8q9ps0gdoo2bl158p4llpar583ld0cgejat9qnrgrgde4l5ut8bgn...
```

* Response:

```
{
 "valid": true,
 "accountRS": "XEL-MAYC-ZZ3Y-YX56-6NH52",
 "requestProcessingTime": 2,
 "account": "15295723609781267838",
 "timestamp": 49762488
}
```
-------------------
### 8.3 Generate File Token

* Request:

```
http://localhost:17876/nxt?requestType=generateFileToken&secretPhrase=secretPhrase&file=test.txt
```

The request is shown above in URL format for consistency. The actual request must be an HTTP POST request with a multipart content type. For example, the corresponding cURL command is as follows:

```
curl -F requestType=generateFileToken -F file=@test.txt -F secretPhrase="secretPhrase" http://localhost:17876/nxt

```

* Response:

```
{
"valid": true,
"accountRS": "XEL-MAYC-ZZ3Y-YX56-6NH52",
"requestProcessingTime": 4,
"account": "15295723609781267838",
"timestamp": 49748229,
"token": "u8q9ps0gdoo2bl158p4llpar583ld0cgejat9qnrgrgde4l5uscgan7fu25hi..."
}
```
-------------------
### 8.4 Generate Token

* Request:

```
http://localhost:17876/nxt?requestType=generateToken&secretPhrase=secretPhrase&website=test
```

* Response:

```
{
 "valid": true,
 "accountRS": "XEL-MAYC-ZZ3Y-YX56-6NH52",
 "requestProcessingTime": 4,
 "account": "15295723609781267838",
 "timestamp": 49762488,
 "token": "u8q9ps0gdoo2bl158p4llpar583ld0cgejat9qnrgrgde4l5ut8bgn..."
}
```
