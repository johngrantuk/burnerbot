//const ethers=require('ethers');
const Web3 = require('web3');

module.exports = {

  getRandomWallet: function(){
    WEB3_PROVIDER = "https://dai.poa.network";
    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));
    var wallet = web3.eth.accounts.create();
    return wallet;
  },

  getBalanceFromPk: async function(Pk){
    WEB3_PROVIDER = "https://dai.poa.network";

    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));

    //let balancePromise = web3.eth.getBalance('0xCA733c4682d84e9d02F5414Bf361D76d4D833E42');
    let balancePromise = await web3.eth.getBalance('0xCA733c4682d84e9d02F5414Bf361D76d4D833E42');
    balancePromise = web3.utils.fromWei(balancePromise, 'ether');
    console.log('okkkkkkk')
    console.log(balancePromise);
    return balancePromise;
  }
}
