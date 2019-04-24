var assert = require('assert');
var poa = require('../poa_helpers');
var server = require('../server_helpers');

describe('Process Testing', function() {

  describe('#send process', function() {

    it('sending dai', async function() {
      this.timeout(300000);
      // Address 1: https://blockscout.com/poa/dai/address/0x8f80708cae88d8487a8a270e7a641f16ceee472e/transactions, '297b32d607127b254f06a12867839779a330abf798662d68e40d217ba3876d85'
      // Address 2: https://blockscout.com/poa/dai/address/0xCA733c4682d84e9d02F5414Bf361D76d4D833E42, '067d36daacc3d304bd1d4f160bf0b2bfcbdfc28d763f7d695f7ba8262868d3d8'

      var sender_username = poa.hash('jguk'); // 0x693290af4c5266969bac9feaaf0e8330f496c3fc5e76505cabb3a9cdcd84e61a
      // 0x99047cf9115da3b79a3ea90f412512604eec1ef69045c31b6cfa07a9f6d01bda

      info = await server.getUserAddress(sender_username);
      assert.equal('ok', info.data.status);
      assert.equal(info.data.address, '0xCA733c4682d84e9d02F5414Bf361D76d4D833E42');

      var senderBalance = await poa.getBalance(info.data.address);
      var isBalance = (senderBalance > 0);
      assert.equal(isBalance, true);

      info = await server.getUserInfo(sender_username, '0x99047cf9115da3b79a3ea90f412512604eec1ef69045c31b6cfa07a9f6d01bda');
      assert.equal('ok', info.data.status);
      assert.equal(info.data.address, '0xCA733c4682d84e9d02F5414Bf361D76d4D833E42');
      assert.equal(info.data.username, sender_username);

      var receiver_username = poa.hash('test-receiver');

      receiver_info = await server.getUserAddress(receiver_username);

      if(receiver_info.data.status == 'no-user'){
        console.log('Got To Register User');
        var newWallet = poa.getRandomWallet();
        var temp_hash = poa.hash('temp_hash');
        var register = await server.registerUser(receiver_username, temp_hash, newWallet.address, newWallet.privateKey);
        receiver_info.data.address = newWallet.address;
      }else if(receiver_info.data.status == 'ok'){
        console.log('Got Receiver Info.');
      }else{
        console.log('Nope!')
        return;
      }

      console.log('Sender Balance: ' + senderBalance);

      console.log('Receiver Address: ' + receiver_info.data.address);
      var receiverBalance = await poa.getBalance(receiver_info.data.address);
      console.log('Receiver Balance: ' + receiverBalance);

      var amountDai = '0.01';
      // Send
      await poa.sendDai(info.data.address, info.data.privatekey, receiver_info.data.address, amountDai);

      var newSenderBalance = await poa.getBalance(info.data.address);
      var newReceiverBalance = await poa.getBalance(receiver_info.data.address);

      assert.equal(newSenderBalance, senderBalance - 0.01);
      assert.equal(newReceiverBalance, receiverBalance + 0.01);

    });

  });

});
