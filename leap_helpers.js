#!/usr/bin/env node
const Web3 = require('web3');
const ethers = require('ethers');

const { Tx, helpers } = require('leap-core');


async function send(sendAccount, send_pk, receiveAccount, amount) {

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
