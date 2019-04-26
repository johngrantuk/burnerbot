var assert = require('assert');
var bot = require('../bot_helpers');

describe('Bot Tests', function() {

  describe('#testing bot commands', function() {

    var discord = {
      'author':{
        'username': 'jguk',
        'discriminator': '9008'
      }
    }

    it('should display menu embed', async function() {

      var output = await bot.parseInput(undefined, discord);

      assert.equal(output.content, undefined);

      var isUsername = output.embed.description.includes("Hi @jguk#9008");
      assert.equal(isUsername, true);
      assert.equal(output.embed.title, "Burner Bot Menu");
    })

    it('should display balance info', async function() {

      var output = await bot.parseInput(['balance'], discord);

      var isBalance = output.content.includes("You have ");
      var isEmbed = output.embed.description.includes('See more info')
      assert.equal(isBalance, true);
      assert.equal(isEmbed, true);

      var output = await bot.parseInput(['balance some random stuff'], discord);

      var isBalance = output.content.includes("You have ");
      var isEmbed = output.embed.description.includes('See more info')
      assert.equal(isBalance, true);
      assert.equal(isEmbed, true);
    })

    it('should fail send', async function() {

      var output = await bot.parseInput(['send me the wrong info'], discord);

      var isPrompt = output.content.includes("Incorrect Format");

      assert.equal(isPrompt, true);
    })

    it('should fail a send because of no balance', async function() {
      this.timeout(300000);
      var output = await bot.parseInput(['send @jguk#9008 1'], discord);

      assert.equal(output.content, 'You need some xDai in your account');
    })

    it('should fail withdraw', async function() {

      var output = await bot.parseInput(['withdraw me the wrong info'], discord);

      var isPrompt = output.content.includes("Incorrect Format");

      assert.equal(isPrompt, true);
    })

    it('should fail a withdraw because of no balance', async function() {
      this.timeout(300000);
      var output = await bot.parseInput(['withdraw 0x8f80708Cae88d8487A8A270E7a641f16cEEe472e 1'], discord);

      assert.equal(output.content, 'You need some xDai in your account');
    })

    it('test an info command', async function() {

      var userInfo = await bot.get_or_set_user_info('@jguk#9008');

      if(userInfo.iscreated){
        console.log('THAT WAS A NEW USER');
      }else{
        console.log('THAT USER EXISTED');
      }

      var output = await bot.parseInput(['info'], discord);

      assert.equal(output.embed.title, 'Burner Bot Info');
    })

  })
})
