const Web3 = require('web3');

module.exports = {

  getRandomWallet: function(){
    WEB3_PROVIDER = "https://dai.poa.network";
    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));
    var wallet = web3.eth.accounts.create();
    return wallet;
  },

  hash: function(input){
    WEB3_PROVIDER = "https://dai.poa.network";
    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));
    return web3.utils.sha3(input);
  },

  getBalance: async function(Address){
    WEB3_PROVIDER = "https://dai.poa.network";

    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));

    //let balancePromise = web3.eth.getBalance('0xCA733c4682d84e9d02F5414Bf361D76d4D833E42');
    let balancePromise = await web3.eth.getBalance(Address);
    balancePromise = web3.utils.fromWei(balancePromise, 'ether');
    console.log('getBalance(): ' + balancePromise);
    return balancePromise;
  },

  sendDai: async function (SenderAddress, PrivateKey, DestinationAddress, EthAmount) {

    WEB3_PROVIDER = "https://dai.poa.network";

    const OPTIONS = {
      defaultBlock: "latest",
      transactionConfirmationBlocks: 3,
      transactionBlockTimeout: 5
    };

    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER), null, OPTIONS);

    var value = web3.utils.toWei(EthAmount, 'ether');
    console.log('Sending (WEI): ' + value); // "1000000000000000000"
    console.log('To: ' + DestinationAddress);

    let nonce = await web3.eth.getTransactionCount(SenderAddress);
    console.log('Nonce: ' + nonce)

    var tx = {
      from: SenderAddress,
      to: DestinationAddress,
      value: value,
      gas: 21000,
      gasPrice: web3.utils.toWei('1', 'gwei'),
      nonce: nonce
    }

    console.log('Signing');
    var signed = await web3.eth.accounts.signTransaction(tx, PrivateKey);
    // console.log(signed
    // DOESN'T WAIT BUT WORKS
    console.log('sending...');
    web3.eth.sendSignedTransaction(signed.rawTransaction, function(error, hash){
      console.log('I think this is the hash?')
      console.log(hash);
    });
    /*
    This one get hung
    await web3.eth.sendSignedTransaction(signed.rawTransaction, async function(error, hash){
      console.log('I think this is the hash?')
      console.log(hash);
      var count = 0;
      var receipt = null;
      while(true){
        console.log('Checking receipt...')
        receipt = await web3.eth.getTransactionReceipt(hash);
        if(receipt != null){
          console.log(receipt.status);
          if(receipt.status == true){
            console.log('All good')
            return;
          }
        }

        console.log(':(')

        count = count + 1;
        if(count > 100){
          console.log('Failed');
          return;
        }
      }
    });
    */
    /*
    THROWS WEIRD NODE ERROR
    await web3.eth.sendSignedTransaction(signed.rawTransaction)
    .then(function(receipt){
      console.log('Should be the receipt...');
      console.log(receipt);
      if(receipt.status == true){
        console.log('All good')
        return;
      }else {
        console.log('Bugger')
      }

    })
    .catch(err => console.log(err))
    */
    /*
    var tran = null;
    web3.eth.sendSignedTransaction(signed.rawTransaction, function(error, hash){ tran = hash});

    while(tran == null){

    }
    console.log('Is this a transaction?')
    console.log(tran);

    var count = 0;
    while(true){
      console.log('Checking receipt...')
      var receipt = await web3.eth.getTransactionReceipt(tran);
      console.log(receipt.status);
      if(receipt.status == true){
        console.log('All good')
        return;
      }

      count = count + 1;
      if(count > 100){
        console.log('Failed');
        return;
      }
    }
    */

  },

  sendDaiOld: async function (SenderAddress, PrivateKey, DestinationAddress, EthAmount) {

    WEB3_PROVIDER = "https://dai.poa.network";

    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));

    var value = web3.utils.toWei(EthAmount, 'ether');
    console.log('Sending (WEI): ' + value); // "1000000000000000000"

    let nonce = await web3.eth.getTransactionCount(SenderAddress);
    console.log('Nonce: ' + nonce)

    var tx = {
      from: SenderAddress,
      to: DestinationAddress,
      value: value,
      gas: 21000,
      gasPrice: web3.utils.toWei('1', 'gwei'),
      nonce: nonce
    }

    web3.eth.accounts.signTransaction(tx, PrivateKey).then(signed => {
      var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);

      tran.on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmation: ' + confirmationNumber);
      });

      tran.on('transactionHash', hash => {
        console.log('hash');
        console.log(hash);
      });

      tran.on('receipt', receipt => {
        console.log('reciept');
        console.log(receipt);
      });

      tran.on('error', console.error);
    });
  },

  sendTransaction: async function (PrivateKey, DestinationAddress, EthAmount) {

    WEB3_PROVIDER = "https://dai.poa.network";

    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));

    var value = web3.utils.toWei(EthAmount, 'ether');
    console.log('Sending (WEI): ' + value); // "1000000000000000000"

    let transaction = web3.eth.sendTransaction({
      from: PrivateKey,
      to: DestinationAddress,
      value: value})
      .on('transactionHash', function(hash){
        console.log('Transaction Hash');
        console.log(hash);
      })
      .on('receipt', function(receipt){
        console.log('Receipt:')
        console.log(receipt)
      })
      .on('confirmation', function(confirmationNumber, receipt){
        console.log('Confirmation!')
      })
      .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
  }
}
