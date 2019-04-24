var assert = require('assert');
var poa = require('../poa_helpers');

describe('PoA Network Test', function() {
  /*
  describe('#getBalance()', function() {
    it('should return 0.9899768252 xDAI', async function() {
      // https://blockscout.com/poa/dai/address/0xca733c4682d84e9d02f5414bf361d76d4d833e42/transactions
      balance = await poa.getBalance("0xCA733c4682d84e9d02F5414Bf361D76d4D833E42");
      assert.equal(0.9899768252, balance);
    });

  });
  */

  describe('#makeAccount()', function() {
    it('should make a random account', async function() {
      wallet = poa.getRandomWallet();

      console.log('Wallet:');
      console.log(wallet.address);
    });
  });
  /*
  describe('#sendTransaction()', function() {
    it('should transfer value', async function() {
      this.timeout(300000);
      // https://blockscout.com/poa/dai/address/0x8f80708cae88d8487a8a270e7a641f16ceee472e/transactions

      var balance1 = await poa.getBalance("0xCA733c4682d84e9d02F5414Bf361D76d4D833E42");
      //assert.equal(0.9899768252, balance1);
      var balance2 = await poa.getBalance("0x8f80708cae88d8487a8a270e7a641f16ceee472e");
      //assert.equal(0, balance2);
      console.log(balance1)
      console.log(balance2)
      var amountDollar = '0.01';
      // '0xCA733c4682d84e9d02F5414Bf361D76d4D833E42', '067d36daacc3d304bd1d4f160bf0b2bfcbdfc28d763f7d695f7ba8262868d3d8'
      // 297b32d607127b254f06a12867839779a330abf798662d68e40d217ba3876d85
      await poa.sendDai('0x8f80708cae88d8487a8a270e7a641f16ceee472e', '297b32d607127b254f06a12867839779a330abf798662d68e40d217ba3876d85', '0xCA733c4682d84e9d02F5414Bf361D76d4D833E42', amountDollar);
      balance1 = await poa.getBalance("0xCA733c4682d84e9d02F5414Bf361D76d4D833E42");
      balance2 = await poa.getBalance("0x8f80708cae88d8487a8a270e7a641f16ceee472e");

      console.log(balance1)
      console.log(balance2)

    });
  });
  */
});
