#!/usr/bin/env node
const Web3 = require('web3');
const ethers = require('ethers');
const ethUtil = require('ethereumjs-util');
var server = require('./server_helpers');

const { Tx, Outpoint, Input, Output, helpers } = require('leap-core');

module.exports = {

  CreateHashLock: async function(LockMessage, SendAccount, Send_pk, Amount){
    // Creates a hash lock condition with a custom lock message
    let tokenAddr  = '0xD2D0F8a6ADfF16C2098101087f9548465EC96C98';                       // LEAP Token contract address
    let abi;
    let codeBuf;
    let codeHash;
    let spAddr;
    let spendingCondition;

    const provider = new ethers.providers.JsonRpcProvider(process.env['RPC_URL'] || 'https://testnet-node1.leapdao.org');

    const lockmessage_hash = ethers.utils.solidityKeccak256(['string'], [LockMessage])

    try {
      spendingCondition = require('./HashLockConditionJohns.json');
    } catch (e) {
      console.error('Please run `npm run compile:contracts` first. 😉');
      return;
    }

    const TOKEN_PLACEHOLDER = '2222222222222222222222222222222222222222';

    abi = new ethers.utils.Interface(spendingCondition.abi);

    codeBuf = spendingCondition.deployedBytecode
      .replace(TOKEN_PLACEHOLDER, tokenAddr.replace('0x', '').toLowerCase())
      .replace('COND_HASH', lockmessage_hash);                                       // CHANGES ADDRESS & HASH MESSAGE IN CONTRACT INFO

    codeHash = ethUtil.ripemd160(codeBuf);
    spAddr = '0x' + codeHash.toString('hex');                                       // THIS IS THE SPENDING CONDITION ADDRESS

    console.log('Send some tokens to: ');
    console.log(spAddr);

    this.send(SendAccount, Send_pk, spAddr, Amount)                               // Fund spending condition

    let txHash = '';
    let firstFetch = true;

    while (true) {
      const done = await new Promise(
        async (resolve, reject) => {
          // check every 3 seconds
          setTimeout(async () => {
            console.log(`Calling: plasma_unspent [${spAddr}]`);

            let res = await provider.send('plasma_unspent', [spAddr]);  // Returns the list of UTXOs for a given address, in this case the contract
            let tx = res[0];

            if (tx) {
              let newTxHash = tx.outpoint.substring(0, 66);

              if (firstFetch) {
                txHash = newTxHash;
                firstFetch = false;
                resolve(false);
                return;
              }

              if (newTxHash !== txHash) {
                console.log(`found new unspent UTXO(${newTxHash})`);
                txHash = newTxHash;
                resolve(true);
                return;
              }
            }
            firstFetch = false;
            resolve(false);
          }, 3000);
        }
      );

      if (done) {
        break;
      }
    }

    let tx = await provider.send('eth_getTransactionByHash', [txHash]);   // Returns the information about a transaction requested by transaction hash.
    let txIndex = tx.transactionIndex;                  //  integer of the transactions index position in the block. null when its pending.
    let txValue = tx.value;                           // value transferred. Taken from the first output. null if there is no outputs.

    console.log(txHash)
    console.log(tx);
    console.log(txIndex);
    console.log(txValue);

    var id = await server.registerSpendingCondition(txhash, tx, txIndex, txValue);    // Registers to db

    return id;
  },

  ClaimHashLock: async function(SpendingConditionId, Message, myAddr){
    // Lets a user claim a hash lock condition
    let tokenAddr = '0xD2D0F8a6ADfF16C2098101087f9548465EC96C98';   // LEAP Token contract address;
    let abi;
    let codeBuf;
    let codeHash;
    let spAddr;
    let msgData;
    let spendingCondition;

    try {
      spendingCondition = require('./HashLockConditionJohns.json');
    } catch (e) {
      console.error('Please run `npm run compile:contracts` first. 😉');
      return;
    }

    abi = new ethers.utils.Interface(spendingCondition.abi);

    msgData = abi.functions.fulfill.encode([Message, myAddr]);

    var spendingCondition = await server.getSpendingCondition(SpendingConditionId);    // Get info from spending condition
    // !!!! FROM CREATE - Store and request in db? bot plasma claim id lock_phrase_no_spaces
    /*
    var txHash = '0x46a9ea5046757d7b5660e05bf80b6c3823a36ff6ce655ee3783a494bcb9b867c';
    var tx = {
      value: '0x9184e72a000',
      color: 0,
      hash:
       '0x46a9ea5046757d7b5660e05bf80b6c3823a36ff6ce655ee3783a494bcb9b867c',
      from: '0xf8b908e7dbb3a0f2581aa8f1962f9360e10dc059',
      raw:
       '0x03115d95a96609db2dbdb42a1687df9e8e94caa0c6457c86e69514bc7192b037500000d547cd9ecdcc9412fa0359a2ce12b40c9392b42b2be193ac4fc2a6889013fe2346589fccdbf7f62bb1bf619a3cbc5d59f95c790b0c536070e04b569ce086df271b000000000000000000000000000000000000000000000000000009184e72a000000084f4a8a19dcb3b0af6a84e5585a1c72155e4c485',
      blockHash:
       '0x77a34e6e92e035f38ba97e78226552f69cfe96a9fd69167a5134c73cda634bee',
      blockNumber: '0x702a',
      transactionIndex: 0,
      to: '0x84f4a8a19dcb3b0af6a84e5585a1c72155e4c485',
      gas: '0x0',
      gasPrice: '0x0',
      nonce: 0,
      input: '0x' };
    var txIndex = 0;
    var txValue = '0x9184e72a000';
    */

    const TOKEN_PLACEHOLDER = '2222222222222222222222222222222222222222';

    codeBuf = spendingCondition.deployedBytecode
      .replace(TOKEN_PLACEHOLDER, tokenAddr.replace('0x', '').toLowerCase());       // CHANGES ADDRESS

    // create the spending condition
    const input = new Input(
      {
        prevout: new Outpoint(spendingCondition.txHash, spendingCondition.txIndex),
        gasPrice: 0,
        script: codeBuf,
      }
    );

    input.setMsgData(msgData);          // This is the smart contract called function

    const output = new Output(spendingCondition.txValue, myAddr, 0);
    const condTx = Tx.spendCond(
      [input],
      [output]
    );

    console.log('input', JSON.stringify(input));
    console.log('output', JSON.stringify(output));

    const txRaw = condTx.hex();
    const res = await provider.send('eth_sendRawTransaction', [txRaw]);           // Creates new message call transaction or a contract creation for signed transactions.
    console.log('transaction hash:', res);
    console.log('claimed');

  },

  send: async function(sendAccount, send_pk, receiveAccount, amount){
    // Basic send function to transfer tokens between addresses
    /*
    var sendAccount = 'AnAddress';
    var send_pk = 'APrivateKey';
    var receiveAccount = 'AnotherAddress';
    var amount = 0.00001;
    var color = 0;
    */

    //const provider = new ethers.providers.JsonRpcProvider(process.env['RPC_URL'] || 'https://testnet-node1.leapdao.org');
    //const web3 = helpers.extendWeb3(new Web3('https://testnet-node.leapdao.org'));
    const web3 = helpers.extendWeb3(new Web3('https://testnet-node1.leapdao.org'));

    const utxo = await web3.getUnspent(sendAccount);

    const inputs = helpers.calcInputs(
      utxo,
      sendAccount,
      amount, // amount to send
      color // your token color
    );

    const outputs = helpers.calcOutputs(
      utxo,
      inputs,
      sendAccount,
      receiveAccount, // destination address
      amount, // amount to send
      color // your token color
    );

    const tx = Tx.transfer(inputs, outputs);

    tx.signAll(send_pk);
    // await tx.signWeb3(web3); //metamask or something

    await web3.eth.sendSignedTransaction(tx.hex())
    console.log('signed??')
  }
}
