var assert = require('assert');
var poa = require('../poa_helpers');

describe('PoA Network Test', function() {

  describe('#getBalance()', function() {
    it('should return 0.9899768252 xDAI', async function() {
      balance = await poa.getBalanceFromPk("067d36daacc3d304bd1d4f160bf0b2bfcbdfc28d763f7d695f7ba8262868d3d8");

      assert.equal(0.9899768252, balance);
    });
  });

  describe('#makeAccount()', function() {
    it('should make a random account', async function() {
      wallet = poa.getRandomWallet();

      console.log('Wallet:');
      console.log(wallet.address);
    });
  });
});
