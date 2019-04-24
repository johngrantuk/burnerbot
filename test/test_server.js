var assert = require('assert');
var server = require('../server_helpers');
var poa = require('../poa_helpers');
const Web3 = require('web3');

describe('Server Test', function() {
/*
  WEB3_PROVIDER = "https://dai.poa.network";
  let web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER));
  var wallet = poa.getRandomWallet();
  var username = web3.utils.sha3('jguk#9008');

  describe('#get address - user not exist', function() {
    it('should get no-user status', async function() {
        info = await server.getUserAddress(username);
        assert.equal('no-user', info.data.status);
    });
  });

  describe('registerUser() - add new user', function() {
    it('should add new user', async function() {
        info = await server.registerUser(username, 'HashOk', wallet.address, wallet.privateKey);
        assert.equal('user-added', info.data.status);
    });
  });

  describe('#get address - user nexist', function() {
    it('should get user address', async function() {
        info = await server.getUserAddress(username);
        assert.equal('ok', info.data.status);
        assert.equal(wallet.address, info.data.address);
        assert.equal(username, info.data.username);
    });
  });

  describe('#get user info - correct hash', function() {
    it('should get user info', async function() {
        info = await server.getUserInfo(username, 'HashOk');
        assert.equal('ok', info.data.status);
        assert.equal(wallet.address, info.data.address);
        assert.equal(username, info.data.username);
        assert.equal(wallet.privatekey, info.data.private_key);
    });
  });

  describe('#get user info - correct hash', function() {
    it('should get user info', async function() {
        info = await server.getUserInfo(username, 'HashOk');
        assert.equal('ok', info.data.status);
        assert.equal(wallet.address, info.data.address);
        assert.equal(username, info.data.username);
        assert.equal(wallet.privatekey, info.data.private_key);
    });
  });

  describe('#get user info - incorrect hash', function() {
    it('should get user info', async function() {
        info = await server.getUserInfo(username, 'HashWronf');
        assert.equal('cheeky-monkey', info.data.status);
    });
  });
*/
});
