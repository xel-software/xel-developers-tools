-------------------
# The XEL API
-------------------
-------------------
# 1 Description
-------------------

The XEL API allows interaction with XEL nodes using HTTP requests to port 17876. Most HTTP requests can use either the GET or POST methods, but some API calls accept only the POST method for security reasons. Responses are returned as JSON objects.

Each API call is documented below, with definitions given for HTTP request parameters and JSON response fields, followed by an example:

* The JSON response fields are each followed by one of S for string, A for array, O for object, N for number or B for boolean.
* In the examples, the XEL node is represented as localhost and requests and responses are formatted for easy reading; line breaks and spaces are not actually used except in some parameter values. All requests are in URL format which implies the HTTP GET method. When GET is allowed, the URL can be entered into a browser URL field but proper URL encoding is usually required (e.g., spaces in a parameter value must be replaced by + or %20). Otherwise, the URL should be used as a guide to preparing an HTTP POST request using cURL, for example.

All API calls can be viewed and tested at http://localhost:17876/test while the local server node is running. For specific API calls, use http://localhost:17876/test?requestType=specificRequestType.

-------------------
# 2 General Notes
-------------------

-------------------
### 2.1 Genesis Block
-------------------

Many API requests make reference to the genesis block. FYI, the genesis block's ID is 13769421951337852026 .

-------------------
### 2.2 Quantity Units XEL, NQT and QNT
-------------------

The XEL system has a currency XEL used to quantify value in the system. Like all currencies, XEL circulates in the system, moving from one user to another by payments . Also, a small fee is required for every transaction, including those in which no XEL is transferred, such as simple messages. This fee goes to the owner of the node that forges (generates) the new block containing the transaction that is accepted onto the blockchain.

One hundred millions XEL were created in the Genesis Block, and no new XEL will ever be created. XEL is divisible to eight decimal places. Yet internally, the currency is still stored in integer form in units of NQT or NxtQuant, where 1 XEL = 108 NQT. All parameters and fields in the API involving a quantity of XEL are denominated in units of NQT, for example feeNQT. The only exception is the field effectiveBalanceNXT, used in forging calculations.

The XEL system can be thought of as an asset owned by all who posses XEL. In this sense, XEL quantifies ownership of or stake in the system. Stakeholders are entitled to forge blocks and collect transaction fees in proportion to the amount of XEL they possess.

-------------------
#### 2.3 Creating Unsigned Transactions
-------------------

All API requests that create a new transaction will accept either a secretPhrase or a publicKey parameter:

* If secretPhrase is supplied, a transaction is created, signed at the server, and broadcast by the server as usual.
* If only a publicKey parameter is supplied as a 64-digit (32-byte) hex string, the transaction will be prepared by the server and returned in the JSON response as transactionJSON without a signature. This JSON object along with secretPhrase can then be supplied to Sign Transaction as unsignedTransactionJSON and the resulting signed transactionJSON can then be supplied to Broadcast Transaction. This sequence allows for offline signing of transactions so that secretPhrase never needs to be exposed.
* unsignedTransactionBytes may be used instead of unsigned transactionJSON when there is no encrypted message. Messages to be encrypted require the secretPhrase for encryption and so cannot be included in unsignedTransactionBytes.

-------------------
#### 2.4 Prunable Data
-------------------

Prunable data can be removed from the blockchain without affecting the integrity of the blockchain. When a transaction containing prunable data is created, only the 32-byte sha256 hash of the prunable data is included in the transactionBytes, not the prunable data itself. The non-prunable signed transactionBytes are used to verify the signature and to generate the transaction's fullHash and ID; when the prunable part of the transaction is removed at a later time, none of these operations are affected.

Prunable data has a predetermined minimum lifetime of two weeks (24 hours on the Testnet) from the timestamp of the transaction. Transactions and blocks received from peer nodes are not accepted if prunable data is missing before this time has elapsed. After this time has elapsed, prunable data is no longer included with transactions and blocks transmitted to peer nodes, and is no longer included in the transaction JSON returned by general-purpose API calls such as Get Transaction; the only way to retrieve it, if still available, is through special-purpose API calls such as Get Prunable Message.

Prunable data can be preserved on a node beyond the predetermined minimum lifetime by setting the nxt.maxPrunableLifetime property to a larger value than two weeks or to -1 to preserve it indefinitely. To force the node to include such preserved prunable data when transactions and blocks are transmitted to peer nodes, set the nxt.includeExpiredPrunables property to true, thus making it an archival node.

Currently, there are two varieties of prunable data in the XEL system: prunable Arbitrary Messages and Tagged Data. Both varities have a maximum prunable data length of 42 kilobytes.

-------------------
### 2.5 Admin Password
-------------------

Some API functions take an adminPassword parameter, which must match the nxt.adminPassword property unless the nxt.disableAdminPassword property is set to true or the API server only listens on the localhost interface (when the nxt.apiServerHost property is set to 127.0.0.1).

All Debug Operations require adminPassword since they require some kind of privilege. On some functions adminPassword is used so you can override maximum allowed value for lastIndex parameter, which is set to 100 by default by the nxt.maxAPIRecords property. Giving you the option to retrieve more than objects per request.

-------------------
### 2.6 Roaming and Light Client Modes
-------------------

The remote node to use when in roaming and light client modes is selected randomly, but can be changed manually in the UI, or using the new set API Proxy Peer API, or forced to a specific peer using the nxt.forceAPIProxyServerURL property.

Remote nodes can be blacklisted from the UI, or using the Blacklist API Proxy Peer API. This blacklisting is independent from peer blacklisting. The API proxy blacklisting period can be set using the nxt.apiProxyBlacklistingPeriod property (default 1800000 milliseconds).

API requests that require sending the secret phrase, shared key, or admin password to the server, for features like forging, are disabled when in roaming or light client mode.

-------------------
# 3 Create Transaction
-------------------

-------------------
#### 3.1 Create Transaction Request
-------------------

The following HTTP POST parameters are common to all API calls that create transactions:

* secretPhrase is the secret passphrase of the account (optional, but transaction neither signed nor broadcast if omitted)
* publicKey is the public key of the account (optional if secretPhrase provided)
* feeNQT is the fee (in NQT) for the transaction:
  * 1 XEL for the first 32 bytes of a unencrypted non-prunable message, 1 XEL for each additional 32 bytes
  * 2 XEL for the first 32 bytes of an encrypted non-prunable message, 1 XEL for each additional 32 bytes. The length is measured excluding the nonce and the 16 byte AES initialization vector.
  * 1 XEL for the first 1024 bytes of a prunable message, 0.1 XEL for each additional 1024 prunable bytes
  * 1 XEL for Set Account Info, including 32 chars, with 2 XEL additional fee for each 32 chars
  * 1 XEL otherwise, where 1 XEL = 100000000 NQT
#### Note: To calculate the minimum fee automatically, set feeNQT to 0 and broadcast to false. The fee will be returned in the result JSON, under transactionJSON.feeNQT.
* deadline is the deadline (in minutes) for the transaction to be confirmed, 32767 minutes maximum
* referencedTransactionFullHash creates a chained transaction, meaning that the current transaction cannot be confirmed unless the referenced transaction is also confirmed (optional)
  broadcast is set to false to prevent broadcasting the transaction to the network (optional)
#### Note: An optional arbitrary message can be appended to any transaction by adding message-related parameters as in Send Message.

#### Note: Any phasing-safe transaction (refer to Create Transaction) can have its execution deferred either conditionally or unconditionally.

-------------------
### 3.2 Create Transaction Response
-------------------

The following JSON response fields are common to all API calls that create transactions:

* signatureHash (S) is a SHA-256 hash of the transaction signature
* unsignedTransactionBytes (S) are the unsigned transaction bytes
* transactionJSON (O) is a transaction object (refer to Get Transaction for details)
* broadcasted (B) is true if the transaction was broadcast, false otherwise
* requestProcessingTime (N) is the API request processing time (in millisec)
* transactionBytes (S) are the signed transaction bytes
* fullHash (S) is the full hash of the signed transaction
* transaction (S) is the ID of the newly created transaction

-------------------
# 4 Account Operations
-------------------

-------------------
### 4.1 Get Account
-------------------

Get account information given an account ID.

### Request:

* requestType is getAccount
* account is the account ID
* includeEffectiveBalance is true to include effectiveBalanceNXT and guaranteedBalanceNQT (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* unconfirmedBalanceNQT (S) is balanceNQT less unconfirmed outgoing transactions, the balance displayed in the client
* effectiveBalanceNXT (N) is the balance (in XEL) of the account available for forging: the unleased guaranteedBalance of this account plus the leased guaranteedBalance of all lessors to this account
* effectiveBalanceNXT (S)
* forgedBalanceNQT (S) is the balance (in NQT) that the account has forged
* balanceNQT (S) is the minimally confirmed basic balance (in NQT) of the account
* publicKey (S) is the public key of the account
* requestProcessingTime (N) is the API request processing time (in millisec)
* guaranteedBalanceNQT (S) is the balance (in NQT) of the account with at least 1440 confirmations
* accountRS (S) is the Reed-Solomon address of the account
* accountCurrencies (A) is an array of currency objects (refer to Get Account Currencies for details)
* name (S) is the name associated with the account, if applicable
* description (S) is the description of the account, if applicable
* account (S) is the account number
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)

-------------------
### 4.2 Get Account Block Count
-------------------

Get the number of blocks forged by an account.

### Request:

* requestType is getAccountBlockCount
* account is an account ID
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* numberOfBlocks (N) is the number of blocks forged by the account
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 4.3 Get Account Block Ids
-------------------

Get the block IDs of all blocks forged (generated) by an account in reverse block height order.

### Request:

* requestType is getAccountBlockIds
* account is the account ID
* timestamp is the earliest block (in seconds since the genesis block) to retrieve (optional)
* firstIndex is a zero-based index to the first block ID to retrieve (optional)
* lastIndex is a zero-based index to the last block ID to retrieve (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* blockIds (A) is an array of block IDs
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millsec)

-------------------
### 4.4 Get Account Blocks
-------------------

Get all blocks forged (generated) by an account in reverse block height order.

### Request:

* requestType is getAccountBlocks
* account is the account ID
* timestamp is the earliest block (in seconds since the genesis block) to retrieve (optional)
* firstIndex is a zero-based index to the first block to retrieve (optional)
* lastIndex is a zero-based index to the last block to retrieve (optional)
* includeTransactions is true to retrieve transaction details, otherwise only transaction IDs are retrieved (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* blocks (A) is an array of blocks (refer to Get Block for details)
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 4.5 Get Account Id
-------------------

Get an account ID given a secret passphrase or public key. POST only.

### Request:

* requestType is getAccountId
* secretPhrase is the secret passphrase of the account (optional)
* publicKey is the public key of the account (optional if secretPhrase provided)

### Response:

* accountRS (S) is the Reed-Solomon address of the account
* publicKey (S) is the public key of the account
* requestProcessingTime (N) is the API request processing time (in millisec)
* account (S) is the account number

-------------------
### 4.6 Get Account Ledger
-------------------

Get multiple account ledger entries.

### Request:

* requestType is getAccountLedger
* account is the account ID (optional)
* event is the event ID (optional)
* eventType is a string representing the event type (optional)
* firstIndex is a zero-based index to the first block to retrieve (optional)
* lastIndex is a zero-based index to the last block to retrieve (optional)
* includeTransactions is true to retrieve transaction details, otherwise only transaction IDs are retrieved (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* entries (A) is an array of ledger objects including the fields:
* ledgerId (S) is the ledger entry ID
* isTransactionEvent (B) is true if the event is associated with a transaction and false if it is associated with a block.
* balance (S) is the balance for the holding identified by 'holdingType'
* holdingType (S) is the item being changed (account balance)
* accountRS (S) is the Reed-Solomon address of the account
* block (S) is the block ID that created the ledger entry
* event (S) is the block or transaction associated with the event
* account (S) is the account number
* height (N) is the the block height associated with the event
* timestamp (N) is the the block timestamp associated with the event
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 4.7 Get Account Public Key
-------------------

Get the public key associated with an account ID.

### Request:

* requestType is getAccountPublicKey
* account is the account ID
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* publicKey (S) is the 32-byte public key associated with the account, returned as a hex string
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 4.8 Get Account Transaction Ids
-------------------

Get the transaction IDs associated with an account in reverse block timestamp order. This call only returns non-phased transactions as of Version 3.2.1 .

### Request:

* requestType is getAccountTransactionIds
* account is the account ID
* timestamp is the earliest block (in seconds since the genesis block) to retrieve (optional)
* type is the type of transactions to retrieve (optional)
* subtype is the subtype of transactions to retrieve (optional)
* firstIndex is a zero-based index to the first transaction ID to retrieve (optional)
* lastIndex is a zero-based index to the last transaction ID to retrieve (optional)
* numberOfConfirmations is the required number of confirmations per transaction (optional)
* withMessage is true to retrieve only only transactions having a message attachment, either non-encrypted or decryptable by the account (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Note: Refer to Get Constants for definitions of types and subtypes

### Response:

* transactionIds (A) is an array of transaction IDs
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 4.9 Get Account Transactions
-------------------

Get the transactions associated with an account in reverse block timestamp order.

### Request:

* requestType is getAccountTransactions
* account is the account ID
* timestamp is the earliest block (in seconds since the genesis block) to retrieve (optional)
* type is the type of transactions to retrieve (optional)
* subtype is the subtype of transactions to retrieve (optional)
* firstIndex is a zero-based index to the first transaction to retrieve (optional)
* lastIndex is a zero-based index to the last transaction to retrieve (optional)
* numberOfConfirmations is the required number of confirmations per transaction (optional)
* withMessage is true to retrieve only only transactions having a message attachment, either non-encrypted or decryptable by the account (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Note: Refer to Get Constants for definitions of types and subtypes

### Response:

* transactions (A) is an array of transactions (refer to Get Transaction for details)
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 4.10 Get Balance
-------------------

Get the balance of an account.

### Request:

* requestType is getBalance
* account is an account ID
* includeEffectiveBalance is true to include effectiveBalanceNXT and guaranteedBalanceNQT (optional)
* height is the height to retrieve account balance for, if still available (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* unconfirmedBalanceNQT (S) is balanceNQT less unconfirmed outgoing transactions, the balance displayed in the client
* guaranteedBalanceNQT (S) is the balance (in NQT) of the account with at least 1440 confirmations
* effectiveBalanceNXT (N) is the balance (in XEL) of the account available for forging: the unleased guaranteedBalance of this account plus the leased
* guaranteedBalance of all lessors to this account
* forgedBalanceNQT (S) is the balance (in NQT) that the account has forged
* balanceNQT (S) is the minimally confirmed basic balance (in NQT) of the account
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 4.11 Get Blockchain Transactions
-------------------

Get the transactions associated with an account in reverse block timestamp order.

### Request:

* requestType is getBlockchainTransactions
* account is the account ID
* timestamp is the earliest block (in seconds since the genesis block) to retrieve (optional)
* type is the type of transactions to retrieve (optional)
* subtype is the subtype of transactions to retrieve (optional)
* firstIndex is a zero-based index to the first transaction to retrieve (optional)
* lastIndex is a zero-based index to the last transaction to retrieve (optional)
* numberOfConfirmations is the required number of confirmations per transaction (optional)
* withMessage is true to retrieve only only transactions having a message attachment, either non-encrypted or decryptable by the account (optional)
* phasedOnly is true to retrieve only phased transactions (optional unless nonPhasedOnly provided)
* nonPhasedOnly is true to retrieve only nonphased transactions (optional unless phasedOnly provided)
* includeExpiredPrunable is true' to retrieve pruned data if available (optional)
* includePhasingResult is true to retrieve execution status of each phased transaction (optional)
* executedOnly is true to exclude phased transactions that are not yet executed (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Note: Refer to Get Constants for definitions of types and subtypes

### Response:

* transactions (A) is an array of transactions (refer to Get Transaction for details)
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 4.12 Get Guaranteed Balance
-------------------

Get the guaranteed balance of an account. This is the minimum balance the account had in the interval

``(currentHeight - numberOfConfirmations, currentHeight]``

Amounts in unconfirmed transactions are not deduced from the result (or included to the result).

### Request:

* requestType is getGuaranteedBalance
* account is an account ID
* numberOfConfirmations is the minimum number of confirmations for a transaction to be included in the guaranteed balance (optional, if omitted or zero then inimally confirmed transactions are included)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* guaranteedBalanceNQT (S) is the balance (in NQT) of the account with at least numberOfConfirmations confirmations
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 4.13 Get Unconfirmed Transaction Ids
-------------------

Get a list of unconfirmed transaction IDs associated with an account.

### Request:

* requestType is getUnconfirmedTransactionIds
* account is one account ID (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)
* firstIndex is a zero-based index to the first transaction ID to retrieve (optional)
* lastIndex is a zero-based index to the last transaction ID to retrieve (optional)

### Response:

unconfirmedTransactionIds (A) is an array of unconfirmed transaction IDs
lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 4.14 Search Accounts
-------------------

Get accounts having a name or description that match a given query in reverse relevance order.

### Request:

* requestType is searchAccounts
* query is a full text query on the account fields name (S) and description (S) in the standard Lucene syntax
* firstIndex is a zero-based index to the first account to retrieve (optional)
* lastIndex is a zero-based index to the last account to retrieve (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* accounts (A) is an array of account objects with the following fields:
* account (S) is the account number
* accountRS (S) is the Reed-Solomon address of the account
* name (S) is the name of the account
* description (S) is the description of the account (if applicable)
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 4.15 Send Money
-------------------

Send XEL to an account. POST only.

### Request: Refer to Create Transaction Request for common parameters.

* requestType is sendMoney
* amountNQT is the amount (in NQT) in the transaction
* recipient is the account ID of the recipient
* recipientPublicKey is the public key of the receiving account (optional, enhances security of a new account)

### Response: Refer to Create Transaction Response.

-------------------
### 4.16 Set Account Info
-------------------

Set account information. POST only.

### Request: Refer to Create Transaction Request for common parameters.

* requestType is setAccountInfo
* name is a name to associate with the account (optional)
* description is a description to associate with the account (optional)
* messagePatternRegex is a regular expression pattern following the java.util.regex.Pattern specification; incoming transactions are only accepted if they contain a plain text message which matches this pattern (disabled indefinitely due to a security issue)
* messagePatternFlags is a bitmask of java.util.regex.Pattern flags, such as 2 (Pattern.CASE_INSENSITIVE)

#### Response: Refer to Create Transaction Response.

-------------------
# 5 Arbitrary Message System Operations
-------------------

-------------------
### 5.1 Decrypt From
-------------------

Decrypt an AES-encrypted message.

### Request:

* requestType is decryptFrom
* secretPhrase is the secret passphrase of the recipient
* account is the account ID of the recipient
* data is AES-encrypted data
* nonce is the unique nonce associated with the encrypted data
* decryptedMessageIsText is false if the decrypted message is a hex string, otherwise the decrypted message is text (optional)
* uncompressDecryptedMessage is false to prevent gzip uncompression after decryption (optional)

### Response:

* decryptedMessage (S) is the decrypted message
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
#### 5.2 Download Prunable Message
-------------------

Downloadins a prunable message attachments directly as binary data. An optional secretPhrase parameter is supported, to allow decryption and downloading of the encrypted part of the message instead of the plain text part.

### Request:

* requestType is downloadPrunableMessage
* transaction is the transaction ID
* secretPhrase is the secret passphrase used to decrypt the encrypted part of the message (optional)
* sharedKey is the shared key used to decrypt the message (optional) (see Get Shared Key)
* retrieve is true to retrieve the message from achival node if needed (optional)
* requireBlock is theblock ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response: The prunable data as a binary file.

-------------------
### 5.3 Encrypt To
-------------------

Encrypt a message using AES without sending it.

### Request:

* requestType is encryptTo
* secretPhrase is the secret passphrase of the sender
* recipient is the account ID of the recipient
* messageToEncrypt is either UTF-8 text or a string of hex digits to be compressed and converted into a 1000 byte maximum bytecode then encrypted using AES
* messageToEncryptIsText is false if the message to encrypt is a hex string, otherwise the message to encrypt is text (optional)
* compressMessageToEncrypt is false to prevent gzip compression before encryption (optional)

### Response:

* data (S) is the AES-encrypted data
* nonce (S) is a 32-byte pseudorandom nonce
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 5.4 Get All Prunable Messages
-------------------

Get all available prunable messages in reverse block timestamp order.

### Request:

* requestType is getAllPrunableMessages
* timestamp is the earliest message (in seconds since the genesis block) to retrieve (optional)
* firstIndex is a zero-based index to the first prunable message to retrieve (optional)
* lastIndex is a zero-based index to the last prunable message to retrieve (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* prunableMessages (A) is an array of prunable messages (refer to Get Prunable Message)
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millsec)

-------------------
### 5.5 Get Prunable Message
-------------------

Get the prunable message given a transaction ID, optionally decrypting it if encrypted and if a secretPhrase is provided, if it is still available.

### Request:

* requestType is getPrunableMessage
* transaction is the transaction ID
* secretPhrase is the secret phrase needed for decryption (optional)
* sharedKey is the shared key used to decrypt the message (optional) (see Get Shared Key)
* retrieve is true to retrieve pruned data from other nodes if not available (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* sender (S) is the sender account number
* senderRS (S) is the Reed-Solomon address of the sender account
* recipient (S) is the recipient account number
* recipientRS (S) is the Reed-Solomon address of the recipient account
* message (S) is the plain message text
* messageIsText (B) is true if the plain message is text, false if it is a hex string
* encryptedMessage (O) is the encrypted message object, containing data (S) and nonce (S) fields
* encryptedMessageIsText (B) is true if the encrypted message is text, false if it is a hex string
* decryptedMessage (S) is the decrypted and decompressed (if necessary) encrypted message, if applicable and if secretPhrase is provided
* isCompressed (B) is true if the encrypted message was compressed before encryption, if applicable
* transaction (S) is the transaction ID
* transactionTimestamp (N) is the transaction timestamp (in seconds since the genesis block)
* blockTimestamp (N) is the block timestamp (in seconds since the genesis block)
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millsec)

-------------------
### 5.6 Get Prunable Messages
-------------------

Get all still-available prunable messages given an account id, optionally limiting to only those with another account as recipient or sender, in reverse chronological order.

### Request:

* requestType is getPrunableMessages
* account is the account ID
* otherAccount is another account ID, either sender or recipient, to limit the response
* secretPhrase is the secret phrase needed for decryption (optional)
* timestamp is the earliest prunable message (in seconds since the genesis block) to retrieve (optional)
* firstIndex is a zero-based index to the first prunable message to retrieve (optional)
* lastIndex is a zero-based index to the last prunable message to retrieve (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* prunableMessages (A) is an array of prunable message objects (refer to Get Prunable Message for details)
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millsec)

-------------------
### 5.7 Get Shared Key
-------------------

Get the one-time shared key used for encryption of messages.

### Request:

* requestType is getSharedKey
* account is the recipient account ID
* secretPhrase is the secret phrase of the sender
* nonce is the 32-byte pseudorandom nonce

### Response:

* sharedKey (S) is shared key as a hexadecimal string
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 5.8 Read Message
-------------------

Get a message given a transaction ID.

### Request:

* requestType is readMessage
* transaction is the transaction ID of the message
* secretPhrase is the secret passphrase of the account that received the message (optional)
* sharedKey is the shared key used to decrypt the message (optional) (see Get Shared Key)
* retrieve is true to retrieve pruned data from archival nodes (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* messageIsPrunable (B) is true if there is a plain message and it is prunable, false if it is not prunable
* message (S) is the plain message, if applicable
* encryptedMessageIsPrunable (B) is true if there is an encrypted message and it is prunable, false if it is not prunable
* decryptedMessage (S) is the decrypted message, if applicable and only if the provided secretPhrase belongs to either the sender or receiver of the transaction
* decryptedMessageToSelf (S) is the decrypted message sent to self, if applicable and only if the provided secretPhrase belongs to the sender of transaction
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 5.9 Send Message
-------------------

Create an Arbitrary Message transaction. POST only.

### Request: Refer to Create Transaction Request for common parameters.

* requestType is sendMessage
* recipient is the account ID of the recipient (optional)
* recipientPublicKey is the public key of the receiving account (optional, enhances security of a new account)
* message is either UTF-8 text or a string of hex digits (perhaps previously encoded using an arbitrary algorithm) to be converted into a bytecode with a maximum length of one kilobyte, 42 kilobytes if prunable (optional)
* messageIsText is false if the message is a hex string, otherwise the message is text (optional)
* messageIsPrunable is true if the message is prunable (optional)
* messageToEncrypt is either UTF-8 text or a string of hex digits to be compressed (unless compressMessageToEncrypt is false) and converted into a bytecode with a maximum length of one kilobyte, 42 kilobytes if prunable, then encrypted using AES (optional)
* messageToEncryptIsText is false if the message to encrypt is a hex string, otherwise the message to encrypt is text (optional)
* encryptedMessageData is already encrypted data which overrides messageToEncrypt if provided (optional)
* encryptedMessageNonce is a unique 32-byte number which cannot be reused (optional unless encryptedMessageData is provided)
* encryptedMessageIsPrunable is true if the encrypted message is prunable (optional)
* compressMessageToEncrypt is false to prevent gzip compression before encryption (optional)
* messageToEncryptToSelf is either UTF-8 text or a string of hex digits to be compressed (unless compressMessageToEncryptToSelf is false) and converted into a one kilobyte maximum bytecode then encrypted with AES, then sent to the sending account (optional)
* messageToEncryptToSelfIsText is false if the message to self-encrypt is a hex string, otherwise the message to encrypt is text (optional)
* encryptToSelfMessageData is already encrypted data which overrides messageToEncryptToSelf if provided (optional)
* encryptToSelfMessageNonce is a unique 32-byte number which cannot be reused (optional unless encryptToSelfMessageData is provided)
* compressMessageToEncryptToSelf is false to prevent gzip compression before encryption (optional)

### Note: Any combination (including none or all) of the three options plain message, messageToEncrypt, and messageToEncryptToSelf will be included in the transaction. However, one and only one prunable message may be included in a single transaction if there is not already a message of the same type (either plain or encrypted).

### Note: The encryptedMessageData-encryptedMessageNonce pair or the encryptToSelfMessageData-encryptToSelfMessageNonce pair can be the output of Encrypt To

### Response: Refer to Create Transaction Response.

-------------------
### 5.10 Verify Prunable Message
-------------------

Verify that a prunable message obtained from any source, when hashed, matches the hash of the original prunable message.

### Request: Refer to Send Message for more details about the following request parameters.

* requestType is verifyPrunableMessage
* message is the plain message, if applicable (optional)
* messageIsText is false if the provided plain message is a hex string (optional)
* encryptedMessageData is the data part of the encrypted data-nonce pair (optional if message provided)
* encryptedMessageNonce is the nonce part of the encrypted data-nonce pair (required if encryptedMessageData provided)
* messageToEncryptIsText is false if the encrypted message was a hex string before encryption (optional)
* compressMessageToEncrypt is false if the encrypted message was not compressed before encryption (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Note: The hash is computed from the message itself plus its associated flag(s) isText and isCompressed (encrypted only); therefore the flag(s) must be provided for verification if different from the default(s). The original encryptedMessageData-encryptedMessageNonce pair used to compute the original hash must be provided again to recompute the hash for verification of a prunable encrypted message.

### Response:

* version.PrunablePlainMessage or version.PrunableEncryptedMessage (N) is 1, the version number
* verify (B) is true if the original hash matches the hash computed from the provided values
* message (S) or encryptedMessage (O) is the prunable plain message or the prunable encrypted message object containing the fields:
  * data (S)
  * nonce (B)
  * isText (B)
  * isCompressed (B)
* messageIsText (B) is true if the plain message is text, false if it is a hex string, if applicable
* messageHash or encryptedMessageHash (S) is the hash
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millsec)

-------------------
# 6 Block Operations
-------------------

-------------------
### 6.1 Get Block
-------------------

Get a block object given a block ID or block height.

### Request:

* requestType is getBlock
* block is the block ID (optional)
* height is the block height (optional if block provided)
* timestamp is the timestamp (in seconds since the genesis block) of the block (optional if height provided)
* includeTransactions is true to include transaction details (optional)
* includeExecutedPhased is true to include approved and executed phased transactions (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Note: block overrides height which overrides timestamp.

### Response:

* previousBlockHash (S) is the 32-byte hash of the previous block
* payloadLength (N) is the length (in bytes) of all transactions included in the block
* totalAmountNQT (S) is the total amount (in NQT) of the transactions in the block
* generationSignature (S) is the 32-byte generation signature of the generating account
* generator (S) is the generating account number
* generatorPublicKey (S) is the 32-byte public key of the generating account
* baseTarget (S) is the base target for the next block generation
* payloadHash (S) is the 32-byte hash of the payload (all transactions)
* generatorRS (S) is the Reed-Solomon address of the generating account
* nextBlock (S) is the next block ID
* numberOfTransactions (N) is the number of transactions in the block
* blockSignature (S) is the 64-byte block signature
* transactions (A) is an array of transaction IDs or transaction objects (if includeTransactions provided, refer to Get Transaction for details)
* executedPhasedTransactions (A) is an array of transaction IDs or transaction objects (if includeExecutedPhased provided, refer to Get Transaction for details)
* version (N) is the block version
* totalFeeNQT (S) is the total fee (in NQT) of the transactions in the block
* previousBlock (S) is the previous block ID
* cumulativeDifficulty (S) is the cumulative difficulty for the next block generation
* block (S) is the block ID
* height (N) is the zero-based block height
* timestamp (N) is the timestamp (in seconds since the genesis block) of the block
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 6.2 Get Block Id
-------------------

Get a block ID given a block height.

### Request:

* requestType is getBlockId
* height is the block height
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* block (S) is the block ID
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 6.3 Get Blocks
-------------------

Get blocks from the blockchain in reverse block height order.

### Request:

* requestType is getBlocks
* timestamp is the earliest block (in seconds since the genesis block) to retrieve (optional)
* firstIndex is first block to retrieve (optional, default is zero or the last block on the blockchain)
* lastIndex is the last block to retrieve (optional, default is firstIndex + 99)
* includeTransactions is true to include transaction details (optional)
* includeExecutedPhased is true to include approved and executed phased transactions (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* blocks (A) is an array of blocks retrieved (refer to Get Block for details)
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 6.4 Get EC Block
-------------------

Get Economic Cluster block data.

### Request:

* requestType is getECBlock
* timestamp is the timestamp (in seconds since the genesis block) of the EC block (optional, default (or zero) is the current timestamp)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Note: If timestamp is more than 15 seconds before the timestamp of the last block on the blockchain, errorCode 4 is returned.

### Response:

* ecBlockHeight (N) is the EC block height
* ecBlockId (S) is the EC block ID
* timestamp (N) is the timestamp (in seconds since the genesis block) of the EC block
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
# 7 Forging Operations
-------------------

-------------------
### 7.1 Start / Stop / Get Forging
-------------------

Start or stop forging with an account, or check to see if an account is forging. POST only.

### Request:

* requestType is either startForging, stopForging or getForging
* secretPhrase is the secret passphrase of the account (optional for stopForging and getForging if password protected like the Debug Operations)

### Response:

* deadline (N) is the estimated time (in seconds since the last block) until the account will forge a block (startForging and getForging only)
* hitTime (N) is the estimated time (in seconds since the genesis block) when the account will forge a block (startForging and getForging only)
* remaining (N) is the deadline less the elapsed time since the last block (getForging only)
* foundAndStopped (B) is true if forging was stopped, false if forging was already stopped (stopForging only)
* account (S) is the account number (getForging only)
* accountRS (S) is the Reed-Solomon address of the account (getForging only)
* requestProcessingTime (N) is the API request processing time (in millisec)

### Note: A getForging request returns errorCode 5 if the account is not forging. If the account has a zero effectiveBalance, forging can be started but deadline, remainingTime and hitTime will be set to zero.

-------------------
### 7.1.1 Get Forging
-------------------

Refer to Start / Stop / Get Forging.
-------------------

### 7.1.2 Start Forging
-------------------

Refer to Start / Stop / Get Forging.

-------------------
### 7.1.3 Stop Forging
-------------------

Refer to Start / Stop / Get Forging.

-------------------
### 7.2 Get Next Block Generators
-------------------

Returns the next block generators ordered by hit time. The list of currently active forgers is first initialized using the block generators with at least 2 blocks generated within the previous 10,000 blocks, excluding accounts without a public key. The list is updated as new blocks are processed. The results are not 100% correct since previously active generators may no longer be running and new generators won't be known until they generate a block.

### Request:

* requestType is getNextBlockGenerators
* limit (N) is the number of next block generators to display.

### Response:

* activeCount (N) is the number of active forging accounts
* lastBlock (S) is the last block ID on the blockchain
* generators (A) is an array containing the number of next block generators requested
* effectiveBalanceNXT (N) is the balance (in XEL) of the account available for forging: the unleased guaranteedBalance of this account plus the leased guaranteedBalance of all lessors to this account
* accountRS (S) is the Reed-Solomon address of the account
* deadline (N) is the estimated time (in seconds since the last block) until the account will forge a block
* account (S) is the account number
* hitTime (N) is the estimated time (in seconds since the genesis block) when the account will forge a block
* requestProcessingTime (N) is the API request processing time (in millisec)
* timestamp (N) is the timestamp (in seconds since the genesis block) when the request was executed
* height (N) is the height of the blockchain

-------------------
# 8 Hallmark Operations
-------------------

-------------------
### 8.1 Decode Hallmark
-------------------

Decode a node hallmark.

### Request:

* requestType is decodeHallmark
* hallmark is the hallmark value

### Response:

* valid (B) is true if host is less than 100 characters, weight > 0 and the embedded signature is verified
* weight (N) is the weight assigned to the hallmark
* host (S) is the IP address or domain name associated with the hallmark
* account (S) is the account number associated with the hallmark
* accountRS (S) is the Reed-Solomon address of the account
* date (S) is the date the hallmark was created, in YYYY-MM-DD format
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 8.2 Mark Host
-------------------

Generates a node hallmark. POST only.

### Request:

* requestType is markHost
* secretPhrase is the secret passphrase for the account that will be hallmarked on the node
* host is the IP address or domain name of the node
* weight is the weight to assign to the node
* date is the current date in YYYY-MM-DD format

### Note: Refer to Create Hallmark for details.

### Response:

* hallmark (S) is the hallmark hex string
* requestProcessingTime (N) is the API request processing time (in millisec)

### Note: Refer to Create Hallmark for instructions for applying the hallmark to a public node.

-------------------
# 9 Networking Operations
-------------------

-------------------
### 9.1 Add Peer
-------------------

Add a peer to the list of known peers and attempt to connect to it. Password protected like the Debug Operations. POST only.

### Request:

* requestType is addPeer
* peer is the IP address or domain name of the peer (plus optional port)

### Response: refer to Get Peer

* isNewlyAdded is true if the peer was not already known, omitted otherwise

-------------------
### 9.2 Blacklist API Proxy Peer
-------------------

Blacklist a remote node from the UI, so it won't be used when in roaming and light client modes. POST only.

### Request:

* requestType is blacklistAPIProxyPeer
* peer is the IP address or domain name of the peer (plus optional port)
* adminPassword is a string with the admin password (optional)

### Response:

* done (B) is true if the peer is blacklisted
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 9.3 Blacklist Peer
-------------------

Blacklist a peer for the default blacklisting period. Password protected like the Debug Operations. POST only.

### Request:

* requestType is blacklistPeer
* peer is the IP address or domain name of the peer (plus optional port)
### Response:

done (B) is true if the peer is blacklisted
requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 9.4 Get Inbound Peers
-------------------

Get all peers that have sent a request to this peer in the last 30 minutes.

### Request:

* requestType is getInboundPeers
* includePeerInfo is true to include peer information, otherwise include only the address (optional)

### Response:

* peers (A) is an array of peer addresses or peer objects (refer to Get Peer for details) depending on includePeerInfo
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 9.5 Get My Info
-------------------

Get hostname and address of the requesting node.

### Request:

* requestType is getMyInfo

### Response:

* host (S) is the node hostname
* address (S) is the node address
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 9.6 Get Peer
-------------------

Get information about a given peer.

### Request:

* requestType is getPeer
* peer is the IP address or domain name of the peer (plus optional port)

### Response:

* hallmark (S) is the hex string of the peer's hallmark, if it is defined
* downloadedVolume (N) is the number of bytes downloaded by the peer
* address (S) the IP address or DNS name of the peer
* weight (N) is the peer's weight value
* uploadedVolume (N) is the number of bytes uploaded by the peer
* version (S) is the version of the software running on the peer
* platform (S) is a string representing the peer's platform
* lastUpdated (N) is the timestamp (in seconds since the genesis block) of the last peer status update
* blacklisted (B) is true if the peer is blacklisted
* services (A) is an array of strings with the services the node provides
* blacklistingCause (S) is the cause of blacklisting (if blacklisted is true)
* announcedAddress (S) is the name that the peer announced to the network (could be a DNS name, IP address, or any other string)
* application (S) is the name of the software application, typically NRS
* state (N) defines the state of the peer: 0 for NON_CONNECTED, 1 for CONNECTED, or 2 for DISCONNECTED
* shareAddress (B) is true if the address is allowed to be shared with other peers
* inbound (B) is true if the peer has made a request to this node
* inboundWebSocket (B) is true if an inbound websocket has been established from this node
* outboundWebSocket (B) is true if an outbound websocket has been established to this node
* lastConnectAttempt (B) is the timestamp (in seconds since the genesis block) of the last connection attempt to the peer
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 9.7 Get Peers
-------------------

Get a list of peer IP addresses.

### Request:

* requestType is getPeers
* active is true for active (not NON_CONNECTED) peers only (optional, if true overrides state)
* state is the state of the peers, one of NON_CONNECTED, CONNECTED, or DISCONNECTED (optional)
* includePeerInfo is true to include peer detail as in Get Peer
* service to filter on a specific service

### Note: If neither active nor state is specified, all known peers are retrieved.

### Response:

* peers (A) is an array of peer addresses
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 9.8 Set API Proxy Peer
-------------------

Set the remote node to use when in roaming and light client modes. POST only.

### Request:

* requestType is setAPIProxyPeer
* peer is the IP address or domain name of the peer (plus optional port)
* adminPassword is a string with the admin password (optional)

### Response:

* downloadedVolume (N) is the number of bytes downloaded by the peer
* address (S) the IP address or DNS name of the peer
* weight (N) is the peer's weight value
* uploadedVolume (N) is the number of bytes uploaded by the peer
* version (S) is the version of the software running on the peer
* platform (S) is a string representing the peer's platform
* blockchainState (S) is a string describing the state of the blockchain in the peer
* lastUpdated (N) is the timestamp (in seconds since the genesis block) of the last peer status update
* blacklisted (B) is true if the peer is blacklisted
* services (A) is an array of strings with the services the node provides
* apiPort (N) is the API access port of the peer
* apiSSLPort (N) is the SSL API access port of the peer
* blacklistingCause (S) is the cause of blacklisting (if blacklisted is true)
* announcedAddress (S) is the name that the peer announced to the network (could be a DNS name, IP address, or any other string)
* application (S) is the name of the software application, typically NRS
* state (N) defines the state of the peer: 0 for NON_CONNECTED, 1 for CONNECTED, or 2 for DISCONNECTED
* shareAddress (B) is true if the address is allowed to be shared with other peers
* inbound (B) is true if the peer has made a request to this node
* inboundWebSocket (B) is true if an inbound websocket has been established from this node
* outboundWebSocket (B) is true if an outbound websocket has been established to this node
* lastConnectAttempt (B) is the timestamp (in seconds since the genesis block) of the last connection attempt to the peer
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
# 10 Server Information Operations
-------------------

-------------------
### 10.1 Event Register
-------------------

Create, modify or remove an event listener which can report server events via Event Wait. POST only.

### Request:

* requestType is eventRegister
* event is one of multiple server events from the following list of event names: (optional, default is all possible events)
 * Block.BLOCK_GENERATED
 * Block.BLOCK_POPPED
 * Block.BLOCK_PUSHED
 * Peer.ADD_INBOUND
 * Peer.ADDED_ACTIVE_PEER
 * Peer.BLACKLIST
 * Peer.CHANGED_ACTIVE_PEER
 * Peer.DEACTIVATE
 * Peer.NEW_PEER
 * Peer.REMOVE
 * Peer.REMOVE_INBOUND
 * Peer.UNBLACKLIST
 * Transaction.ADDED_CONFIRMED_TRANSACTIONS
 * Transaction.ADDED_UNCONFIRMED_TRANSACTIONS
 * Transaction.REJECT_PHASED_TRANSACTION
 * Transaction.RELEASE_PHASED_TRANSACTION
 * Transaction.REMOVE_UNCONFIRMED_TRANSACTIONS
* event is one of multiple server events (optional)
* add is true to add events to an existing listener (optional, omit if remove is true)
* remove is true to remove events from an existing listener (optional, omit if add is true)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Note: To create a new event listener, omit both add and remove. To remove an existing event listener, set remove to true and omit event; all registered events will be removed, any outstanding Event Wait will be completed and the listener will be deactivated.

### Note: An event listener is automatically deactivated whenever all registered events are removed or if Event Wait is not called frequently enough, according to the nxt.apiEventTimeout property. The timeout is not precise; the removal process runs every nxt.apiEventTimeout / 2 seconds, so that many extra seconds may elapse before removal; the first Event Wait call should be made immediately after registration to avoid deactivation.

### Note: Each API user (with a unique address) can create only one event listener. When a new one is created, it will replace an existing one. The maximum number of unique users is controlled by the nxt.maxEventUsers property.

### Response:

* registered is true if the operation completed successfully
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 10.2 Event Wait
-------------------

Wait for events registered with Event Register. POST only.

### Request:

* requestType is eventWait
* timeout is the amount of time (in seconds) to wait for an event before the call returns (optional, default and maximum is the nxt.apiEventTimeout property)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Notes: The call returns immediately if one or more events have occurred since the last call; multiple events are all returned together. If a new call is made before the last one returns, the timeout timer resets to the new value. Event registration expires if wait calls are not made frequently enough, according to the nxt.apiEventTimeout property.

### Response:

* events (A) is an array of event objects each of which has the following fields:
 * name (S) is the name of the event (refer to Event Register for the list of event names)
 * ids (A) is an array of identifiers, depending on the type of event:
  * block string identifier (S) for a block event
  * peer network address (S) for a peer event
  * transaction string identifier (S) for a transaction event
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 10.3 Get Blockchain Status
-------------------

Get the blockchain status.

### Request:

* requestType is getBlockchainStatus

### Response:

* currentMinRollbackHeight (N) is the current minimum rollback height
* numberOfBlocks (N) is the number of blocks in the blockchain (height + 1)
* isTestnet (B) is true if the node is connected to testnet, false otherwise
* includeExpiredPrunable (B) is the value of the nxt.includeExpiredPrunable property
* requestProcessingTime (N) is the API request processing time (in millisec)
* version (S) is the application version
* maxRollback (N) is the value of the nxt.maxRollback property
* lastBlock (S) is the last block ID on the blockchain
* application (S) is application name, typically NRS
* isScanning (B) is true if the blockchain is being scanned by the application, false otherwise
* isDownloading (B) is true if a download is in progress, false otherwise; true when a batch of more than 10 blocks at once has been downloaded from a peer, reset to false when an attempt to download more blocks from a peer does not result in any new blocks
* cumulativeDifficulty (S) is the cumulative difficulty
* lastBlockchainFeederHeight (N) is the height of the last blockchain of greatest cumulative difficulty obtained from a peer
* maxPrunableLifetime (N) is the maximum prunable lifetime (in seconds)
* time (N) is the current timestamp (in seconds since the genesis block)
* lastBlockchainFeeder (S) is the address or announced address of the peer providing the last blockchain of greatest cumulative difficulty
* blockchainState (S) Current state of this node's blockchain (UP_TO_DATE or DOWNLOADING)

-------------------
### 10.4 Get Constants
-------------------

Get all defined constants.

### Request:

* requestType is getConstants

### Response:

* maxBlockPayloadLength (N) is the maximum block payload length (in bytes)
* maxArbitraryMessageLength (N) is the maximum length (in bytes) of an arbitrary message
* maxPrunableMessageLength (N) is the maximum length (in bytes) of a prunable message
* maxTaggedDataDataLength (N) is the maximum length (in bytes) of tagged data
* maxPhasingDuration (N) is the maximum allowed phasing duration in block height
* epochBeginning (N) is the time in milliseconds when genesis block was created
* genesisAccountId (S) is the genesis account number
* genesisBlockId (S) is the genesis block ID
* transactionTypes (A) is an array of defined transaction types and subtypes (refer to the example below)
* transactionSubTypes (A) is an array of defined transaction subtypes and subtypes (refer to the example below)
* peerStates (A) is an array of defined peer states (refer to the example below)
* currencyTypes (A) is an array of defined currency types (refer to the example below)
* disabledAPIs (A) is an array of configured disabled apis (refer to the example below)
* apiTags (A) is an array of defined api tags (refer to the example below)
* disabledAPITags (A) is an array of configured disabled api tags (refer to the example below)
* votingModels (A) is an array of defined voting models (refer to the example below)
* holdingTypes (A) is an array of defined holding types (refer to the example below)
* minBalanceModels (A) is an array of defined minimum balance models (refer to the example below)
* shufflingStages (A) is an array of defined shuffling stages (refer to the example below)
* shufflingParticipantStates (A) is an array of defined shuffling participant states (refer to the example below)
* hashAlgorithms (A) is an array of defined hash algorithms (refer to the example below)
* mintingHashAlgorithms (A) is an array of defined minting hash algorithms (refer to the example below)
* phasingHashAlgorithms (A) is an array of defined phasing hash algorithms (refer to the example below)
* requestTypes (A) is an array of decined request types (refer to the example below)

-------------------
### 10.5 Get Plugins
-------------------

Get a list of all installed plugins on the server.

### Request:

* requestType is getPlugins

### Response:

* plugins (A) is an array of plugin names (S)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 10.6 Get State
-------------------

Get the state of the server node and network.

### Request:

* requestType is getState
* includeCounts is true if the fields beginning with numberOf... are to be included (optional); password protected like the Debug Operations if true.

### Response:

* numberOfPeers (N) is the number of known peers on the network
* numberOfGoods (N) is the number of DGS goods in the blockchain
* numberOfPolls (N) is the number of polls in the blockchain
* numberOfUnlockedAccounts (N) is the number of unlocked accounts on this node
* numberOfTransfers (N) is the number of AE transfers in the blockchain
* includeExpiredPrunable (B) is the value of the nxt.includeExpiredPrunable property
* numberOfOrders (N) is the number of AE orders in the blockchain
* numberOfTransactions (N) is the number of transactions in the blockchain
* maxMemory (N) is the maximum amount of memory the node may use (in Bytes)
* maxRollback (N) is the value of the nxt.maxRollback property
* numberOfOffers (N) is the number of buy currency offers in the blockchain
* isDownloading (B) is true if a download is in progress, false otherwise; true when a batch of more than 10 blocks at once has been downloaded from a peer, reset to false when an attempt to download more blocks from a peer does not result in any new blocks
* isScanning (B) is true if this node is scanning the blockchain, false otherwise
* cumulativeDifficulty (S) is the current cumulative forging difficulty
* numberOfCurrencies (N) is the number of currencies in the blockchain
* numberOfAssets (N) is the number of AE assets in the blockchain
* numberOfPrunableMessages (N) is the number of prunable messages in the blockchain
* freeMemory (N) is the amount of free memory on this node (in Bytes)
* peerPort (N) is the port used for connecting to peers
* numberOfVotes (N) is the number of votes in the blockchain
* availableProcessors (N) is the number of processors on this node
* numberOfTaggedData (N) is the number of tagged data in the blockchain
* numberOfActiveAccountLeases (N) is the number of active account leases in the blockchain
* numberOfAccountLeases (N) is the total number of account leases including scheduled leases (first scheduled lease only) in the blockchain
* numberOfAccounts (N) is the number of accounts in the blockchain
* numberOfDataTags (N) is the number of data tags in the blockchain
* needsAdminPassword (B) is true if the nxt.disableAdminPassword property is false
* currentMinRollbackHeight (N) is the current minimum rollback height
* numberOfBlocks (N) is the number of blocks (height + 1) in the blockchain
* isTestnet (B) is true if the node is connected to testnet, false otherwise
* numberOfCurrencyTransfers (N) is the number of currency transfers in the blockchain
* requestProcessingTime (N) is the API request processing time (in millisec)
* numberOfPhasedTransactions (N) is the number of phased transactions in the blockchain
* version (S) is the software version on this node
* numberOfBidOrders (N) is the number of AE bid orders in the blockchain
* lastBlock (S) is the last block address
* totalMemory (N) is the amount of memory this node is using (in Bytes)
* application (S) is the name of the software running on this node (typically NRS)
* numberOfAliases (N) is the number of aliases in the blockchain
* numberOfActivePeers (N) is the number of active peers on the network
* lastBlockchainFeederHeight (N) is the height of the last blockchain feeder
* maxPrunableLifetime (N) is the maximum prunable lifetime (in seconds)
* numberOfExchanges (N) is the number of currency exchanges in the blockchain
* numberOfTrades (N) is the number of AE trades in the blockchain
* numberOfPurchases (N) is the number of DGS purchases in the blockchain
* numberOfTags (N) is the number of DGS tags in the blockchain
* time (N) is the current node time (in seconds since the genesis block)
* numberOfAskOrders (N) is the number of AE ask orders in the blockchain
* lastBlockchainFeeder (S) is the announced name of the feeder of the last blockchain
* isOffline (B) is true if this node is connected to other peers, false otherwise

-------------------
### 10.7 Get Time
-------------------

Get the current time.

### Request:

* requestType is getTime

### Response:

* time (N) is the current time (in seconds since the genesis block).
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
# 11 Token Operations
-------------------

-------------------
### 11.1 Decode File Token
-------------------

Validate a file token without requiring the transmission of a secret passphrase. POST only.

### Request:

* requestType is decodeFileToken
* file is the path to the file that was signed
* token is the token of the file, as generated by Generate File Token

### Response:

* account (S) is the account number that generated the token
* accountRS (S) is the Reed-Solomon address of the account
* timestamp (N) is the time (in seconds since the genesis block) that the token was generated
* valid (B) is true if token is valid, false otherwise
* requestProcessingTime (N) is the API request processing time (in millisec)

### Note: Since token contains the token generator's public key and digital signature, file can be validated as signed by the owner of the public key, and the public key determines the account ID.

-------------------
### 11.2 Decode Token
-------------------

Validate a token without requiring the transmission of a secret passphrase.

### Request:

* requestType is decodeToken
* website is the signed text, typically an authorized URL
* token is the token generated by Generate Token

### Response:

* account (S) is the account number that generated the token
* accountRS (S) is the Reed-Solomon address of the account
* timestamp (N) is the time (in seconds since the genesis block) that the token was created
* valid (B) is true if token is valid, false otherwise
* requestProcessingTime (N) is the API request processing time (in millisec)

### Note: Since token contains the token generator's public key and digital signature, website can be validated as authorized by the owner of the public key, and the public key determines the account ID.

-------------------
### 11.3 Generate File Token
-------------------

Generate a file token. POST only.

### Request:

* requestType is generateFileToken
* secretPhrase is the passphrase of the account generating the token
* file is the path to the file to be signed

### Response:

* token (S) is a 160 character string representing the 100-byte token which consists of a 32-byte public key, a 4-byte timestamp, and a 64-byte digital signature
* account (S) is the account number corresponding to secretPhrase
* accountRS (S) is the Reed-Solomon address of the account
* timestamp (N) is the time (in seconds since the genesis block) that the token was generated
* valid (B) is true if token is valid, false otherwise
* requestProcessingTime (N) is the API request processing time (in millisec)
### Note: Since token contains the token generator's public key and digital signature, the file can be validated as digitally signed by the owner of the public key using Decode File Token.

-------------------
### 11.4 Generate Token
-------------------

Generate a token. POST only.

### Request:

* requestType is generateToken
* secretPhrase is the passphrase of the account generating the token
* website is a web site URL for which authorization should be granted, or general text to be digitally signed

### Note: website is typically a URL (with the leading http:// unnecessary) that an account owner signs with his secretPhrase (private key) to bind the account to the URL, but website can be any text that the owner wishes to sign.

### Response:

* token (S) is a 160 character string representing the 100-byte token which consists of a 32-byte public key, a 4-byte timestamp, and a 64-byte signature
* account (S) is the account number corresponding to secretPhrase
* accountRS (S) is the Reed-Solomon address of the account
* timestamp (N) is the time (in seconds since the genesis block) that the token was generated
* valid (B) is true if token is valid, false otherwise
* requestProcessingTime (N) is the API request processing time (in millisec)

### Note: Since token contains the token generator's public key and signature, the website can be validated as authorized by the owner of the public key using Decode Token.

-------------------
# 12 Transaction Operations
-------------------

-------------------
### 12.1 Broadcast Transaction
-------------------

Broadcast a transaction to the network. POST only.

### Request:

* requestType is broadcastTransaction
* transactionBytes is the bytecode of a signed transaction (optional)
* transactionJSON is the transaction object (optional if transactionBytes provided)
* prunableAttachmentJSON is the attachment object embedded in transactionJSON containing a prunable message (required if transactionJSON not provided because transactionBytes never includes prunable data)

### Response:

* requestProcessingTime (N) is the API request processing time (in millisec)
* fullHash (S) is the full hash of the signed transaction
* transaction (S) is the transaction ID

-------------------
### 12.2 Calculate Full Hash
-------------------

Calculate the full hash of a transaction.

### Request:

* requestType is calculateFullHash
* unsignedTransactionJSON is the unsigned transaction JSON object (optional)
* unsignedTransactionBytes are the unsigned bytes of a transaction (optional if unsignedTransactionJSON is provided)
* signatureHash is a SHA-256 hash of the transaction signature

### Response:

* requestProcessingTime (N) is the API request processing time (in millisec)
* fullHash (S) is the full hash of the signed transaction

-------------------
### 12.3 Get Transaction
-------------------

Get a transaction object given a transaction ID.

### Request:

* requestType is getTransaction
* transaction is the transaction ID (optional)
* fullHash is the full hash of the transaction (optional if transaction ID is provided)
* includePhasingResult is true to retrieve execution status of each phased transaction (optional)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

## Response:

* sender (S) is the account ID of the sender
* senderRS (S) is the Reed-Solomon address of the sender
* feeNQT (S) is the fee (in NQT) of the transaction
* amountNQT (S) is the amount (in NQT) of the transaction
* transactionIndex (N) is a zero-based index giving the order of the transaction in its block
* timestamp (N) is the time (in seconds since the genesis block) of the transaction
* referencedTransactionFullHash (S) is the full hash of a transaction referenced by this one, omitted if no previous transaction is referenced
* confirmations (N) is the number of transaction confirmations
* subtype (N) is the transaction subtype (refer to Get Constants for a current list of subtypes)
* block (S) is the ID of the block containing the transaction
* blockTimestamp (N) is the timestamp (in seconds since the genesis block) of the block
* height (N) is the height of the block in the blockchain
* senderPublicKey (S) is the public key of the sending account for the transaction
* type (N) is the transaction type (refer to Get Constants for a current list of types)
* deadline (N) is the deadline (in minutes) for the transaction to be confirmed
* signature (S) is the digital signature of the transaction
* recipient (S) is the account number of the recipient, if applicable
* recipientRS (S) is the Reed-Solomon address of the recipient, if applicable
* fullHash (S) is the full hash of the signed transaction
* signatureHash (S) is a SHA-256 hash of the transaction signature
* approved (B) is a boolean indicating if the transaction is approved (only included when includePhasingResult is true and the transaction is phased)
* result (S) is a string containing the result of the transaction (only included when includePhasingResult is true and the transaction is phased)
* executionHeight (N) is the height the transaction was executed (only included when includePhasingResult is true and the transaction is phased)
* transaction (S) is the transaction ID
* version (N) is the transaction version number
* phased (B) is true if the transaction is phased, false otherwise
* ecBlockId (N) is the economic clustering block ID
* ecBlockHeight (N) is the economic clustering block height
* attachment (O) is an object containing any additional data needed for the transaction, if applicable
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

### Note: The block, blockTimestamp and confirmations fields are omitted for unconfirmed transactions. Double-spending transactions are not retrieved.

-------------------
### 12.4 Get Transaction Bytes
-------------------

Get the bytecode of a transaction.

### Request:

* requestType is getTransactionBytes
* transaction is a transaction ID
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* confirmations (N) is the number of transaction confirmations
* transactionBytes (S) are the bytes contained in the transaction
* unsignedTransactionBytes (S) are the unsigned bytes contained in the transaction
* prunableAttachmentJSON (O) is the prunable attachment JSON object, if applicable, because transactionBytes never includes prunable data
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 12.5 Send Transaction
-------------------

It broadcasts a transaction to the network without validating it, without re-broadcasting it and without adding it locally as unconfirmed transaction. Specially intended for roaming or light clients to send transactions to remote peers. POST only.

### Request:

* requestType is sendTransaction
* transactionBytes is the bytecode of a signed transaction (optional)
* transactionJSON is the transaction object (optional if transactionBytes provided)
* prunableAttachmentJSON is the attachment object embedded in transactionJSON containing a prunable message (required if transactionJSON not provided because transactionBytes never includes prunable data)
* adminPassword is a string with the admin password (optional)

### Response:

* requestProcessingTime (N) is the API request processing time (in millisec)
* fullHash (S) is the full hash of the signed transaction
* transaction (S) is the transaction ID

-------------------
### 12.6 Sign Transaction
-------------------

Calculates the full hash, signature hash, and transaction ID of an unsigned transaction.

### Request:

* requestType is signTransaction
* unsignedTransactionJSON is the transactionJSON field of the transaction, without a signature subfield
* unsignedTransactionBytes is the unsignedTransactionBytes field of the transaction (optional, if unsignedTransactionJSON provided)
* prunableAttachmentJSON is a prunable attachment JSON object, if applicable, because unsignedTransactionBytes never includes prunable data (optional if the transaction has already been broadcast and the prunable message can still be retrieved from the database)
* secretPhrase is the secret passphrase of the signing account
* validate is false to skip validation of the transaction bytes being signed (useful on nodes where the full blockchain is not downloaded)
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* signatureHash (S) is a SHA-256 hash of the transaction signature, used in escrow transactions
* verify (B) is true the signature is verified, false if not
* transactionJSON (O) is the signed transaction JSON object
* transactionBytes (S) are the signed transaction bytes
* fullHash (S) is the full hash of the signed transaction
* prunableAttachmentJSON (O) is the prunable attachment JSON object, if applicable, because transactionBytes never includes prunable data
* transaction (S) is the transaction ID, derived from the fullHash
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
# 13 Debug Operations
-------------------
All debug utilities require an adminPassword request parameter.
-------------------
### 13.1 Clear Unconfirmed Transactions
-------------------

Empties the unconfirmed transaction pool. POST only.

### Request:

* requestType is clearUnconfirmedTransactions

### Response:

* done (B) is true if the operation completed successfully
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 13.2 Dump Peers
-------------------

Get all active peers, optionally of a certain version or a minimum weight.

### Request:

* requestType is dumpPeers
* version is a version filter such as 3.2.1 (optional)
* weight is a minimum weight filter such as 1000 (optional)
* connect is true to force a connection attempt to each known peer first (optional); password protected like the Debug Operations if true

### Response:

* peers (S) is a string of peer IP addresses or DNS names, separated by semicolons
* count (N) is the number of peers in the peers string.
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 13.3 Full Reset
-------------------

Deletes the entire blockchain. POST only.

### Request:

* requestType is fullReset

### Response:

* done (B) is true if the operation completed successfully
* requestProcessingTime (N) is the API request processing time (in millisec)

### Note: After successful completion of the reset, a new blockchain will automatically begin downloading.

-------------------
### 13.4 Get All Broadcasted Transactions
-------------------

Get unconfirmed transactions broadcasted from this node but not yet received back from a peer, if transaction rebroadcasting is enabled.

### Request:

* requestType is GetAllBroadcastedTransactions
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* transactions (A) is an array of broadcasted unconfirmed transactions not yet received back from a peer (S)
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 13.5 Get All Waiting Transactions
-------------------

Get unconfirmed transactions temporarily kept in memory during transaction processing.

### Request:

* requestType is getAllWaitingTransactions
* requireBlock is the block ID of a block that must be present in the blockchain during execution (optional)
* requireLastBlock is the block ID of a block that must be last in the blockchain during execution (optional)

### Response:

* transactions (A) is an array of unconfirmed transactions temporarily kept in memory (S)
* lastBlock (S) is the last block ID on the blockchain (applies if requireBlock is provided but not requireLastBlock)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 13.6 Get Log
-------------------

Get up to 100 of the most recent log messages from a memory buffer.

### Request:

* requestType is getLog
* count is the number of messages to return (optional, default 100)

### Response:

* messages (A) is an array of log messages (S)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 13.7 Get Stack Traces
-------------------

Get the stack traces of the currently running threads in reverse id order.

### Request:

* requestType is getStackTraces
* depth is the maximum trace depth to retrieve (optional)

### Response:

* requestProcessingTime (N) is the API request processing time (in millisec)
* locks (A) is an array of lock objects
* threads (A) is an array of thread objects with the following fields:
 * trace (A) is an array of traces (S)
 * name (S) is the thread name
 * id (N) is the thread ID
 * state (S) is the thread state, one of WAITING, TIMED_WAITING and RUNNABLE
 * locks (A) is an array of lock objects with the following fields, if not empty:
  * trace (S)
  * depth (N)
  * name (S)
  * hash (N)

-------------------
### 13.8 Lucene Reindex
-------------------

Forces a rebuild of the Lucene search index. POST only.

### Request:

* requestType is luceneReindex
### Response:

* done (B) is true if the operation completed successfully
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 13.9 Lucene Reindex
-------------------

Removes specified number of blocks (and associated transactions) from the top of the blockchain. POST only.

### Request:

* requestType is popOff
* numBlocks is the number of blocks to pop off the blockchain (optional)
* height is the new height of the blockchain after popping (optional if numBlocks provided)

### Note: If table trimming is enabled (default), at most 1440 blocks can be popped off without triggering a full rescan.

### Response:

* blocks (A) is an array of the blocks popped off (refer to Get Block for details)
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 13.10 Retrieve Pruned Data
-------------------

Initiates a task of requesting and restoring missing prunable data. POST only.

### Request:

* requestType is retrievePrunedData

### Response:

* done (B) is true if the operation completed successfully
* numberOfPrunedData (N) is the number of pruned data available pruned data transactions
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 13.11 Scan
-------------------

Scans the top of the blockchain. POST only.

### Request:

* requestType is scan
* numBlocks is the number of blocks to scan at the top of the blockchain (optional)
* height is the height above which blockchain is to be scanned (optional if numBlocks provided)
* validate is true if signatures are to be re-verified and blocks and transactions re-validated (optional)

### Note: The derived object tables are rolled back and rebuilt by rescanning the existing blockchain. A request to rescan more than 1440 blocks when table trimming is enabled will do a full rescan starting from height 0. Rescan status is saved in the database, so that if a rescan is interrupted or fails it will resume on restart.

### Response:

* scanTime (N) is the scan time
* done (B) is true if the operation completed successfully
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
### 13.12 Set Logging
-------------------

Sets the log level and optionally specifies communication events to be logged, without restarting the server. POST only.

### Request:

* requestType is setLogging
* logLevel is one of ERROR, WARN, INFO or DEBUG with each level in the list including all of the previous levels (optional, default is INFO)
* communicationEvent is one of multiple communication (HTTP) events to be logged, from the list: EXCEPTION, HTTP-ERROR, HTTP-OK (optional)
* communicationEvent is one of multiple communication events (optional)

### Note: The initial log level is set by the nxt.level logging property, currently FINE (equivalent to DEBUG).

### Response:

* loggingUpdated (B) is true if the operation completed successfully

-------------------
### 13.13 Set Logging
-------------------

Shutdown the server. POST only.

### Request:

* requestType is shutdown
* scan is true to truncate the derived tables and schedule a full rescan with validation on the next start (optional)

### Response:

* shutdown (B) is true if the operation completed successfully
* requestProcessingTime (N) is the API request processing time (in millisec)

-------------------
# 14 Computing Engine
-------------------

-------------------
### 14.1 To be updated
-------------------
