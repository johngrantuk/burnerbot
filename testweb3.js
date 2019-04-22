const Web3 = require('web3');

/*
• GET /getBalance/:param
Get the balance of an ethereum address
• POST /transaction { privateKey, destination, amount }
Creates a transaction to send ETH from one address to another. It can receive 3 raw JSON params: privateKey of the source ETH address, destination is the ETH destination address and amount the number of ETH to be send.
*/






exports.GetBalance = function GetBalance (Address) {

      console.log('GetBalance: ' + Address);

      //var web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/'));
      var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/4e6136d03867482c92af86fd1714744b'));


      var balance = web3.eth.getBalance('0xCA733c4682d84e9d02F5414Bf361D76d4D833E42').then(function(value){

        console.log(value)
        var results = {
          test: value
        }

      });
}
