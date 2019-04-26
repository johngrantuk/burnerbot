var assert = require('assert');
var poa = require('../poa_helpers');
var server = require('../server_helpers');
var bot = require('../bot_helpers');

LIVESTEST = false;

describe('Process Testing', function() {

  describe('#process', function() {

    let address;

    it('set a new user - THIS WILL FAIL IF TESTS ALREADY RUN AS db IS SAVED', async function() {

      var newUser = '@thisisanew#1001';

      var result = await bot.get_or_set_user_address(newUser);
      address = result.info.data.address;
      // console.log(result.info.data.address);
      assert.equal(result.iscreated, true);
    })

    it('get an exisiting user', async function() {

      var newUser = '@thisisanew#1001';

      var result = await bot.get_or_set_user_address(newUser);

      assert.equal(result.info.data.address, address);
      assert.equal(result.iscreated, false);
    })

    it('complete send process', async function() {
      if(LIVESTEST){
        this.timeout(300000);
        // Address 1: https://blockscout.com/poa/dai/address/0x8f80708cae88d8487a8a270e7a641f16ceee472e/transactions
        // Address 2: https://blockscout.com/poa/dai/address/0xCA733c4682d84e9d02F5414Bf361D76d4D833E42

        var sender_username = poa.hash('jguk');

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

        var amountDai = '0.001';
        // Send
        await poa.sendDai(info.data.address, info.data.privatekey, receiver_info.data.address, amountDai);

        var newSenderBalance = await poa.getBalance(info.data.address);
        var newReceiverBalance = await poa.getBalance(receiver_info.data.address);

        assert.equal(newSenderBalance, senderBalance - 0.001);
        assert.equal(newReceiverBalance, receiverBalance + 0.001);
      }
    });

  });
});
