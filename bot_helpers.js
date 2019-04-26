var poa = require('./poa_helpers');
var server = require('./server_helpers');

module.exports = {

  get_or_set_user_address: async function(User){

    var user_hash = poa.hash(User);
    var info = await server.getUserAddress(user_hash);
    var created = false;

    if(info.data.status == 'no-user'){
      created = true;
      var newWallet = poa.getRandomWallet();
      var temp_hash = poa.hash('this_will_be_changed_in_the_future_to_be_better');
      var register = await server.registerUser(user_hash, temp_hash, newWallet.address, newWallet.privateKey);
      info.data.address = newWallet.address;
    }

    return {'info': info, 'iscreated': created}
  },

  get_or_set_user_info: async function(User){
    var user_hash = poa.hash(User);
    var pw_hash = poa.hash('this_will_be_changed_in_the_future_to_be_better');

    var info = await server.getUserInfo(user_hash, pw_hash);
    var created = false;

    if(info.data.status == 'cheeky-monkey'){
      created = true;
      var newWallet = poa.getRandomWallet();
      var temp_hash = poa.hash('this_will_be_changed_in_the_future_to_be_better');
      var register = await server.registerUser(user_hash, temp_hash, newWallet.address, newWallet.privateKey);
      info.data.address = newWallet.address;
      info.data.privatekey = newWallet.privateKey;
    }

    return {'info': info, 'iscreated': created}
  },

  send: async function(UserName, ReceiverUserName, DaiAmount, isUser){

    info = await this.get_or_set_user_info(UserName);

    if(info.iscreate == true){
      // won't have any balance
      return {'status': 'just-created'};
    }

    // console.log("*****************************")
    // console.log(info)

    var senderBalance = await poa.getBalance(info.info.data.address);
    if(senderBalance <= 0){
      // won't have any balance
      return {'status': 'no-balance'};
    }

    if(isUser){
      receiver_info = await this.get_or_set_user_address(ReceiverUserName);
      // await poa.sendDai(info.info.data.address, info.info.data.privatekey, receiver_info.info.data.address, DaiAmount);
      return {'status': 'ok', 'newreceiver': receiver_info.iscreate};
    }else{
      // await poa.sendDai(info.info.data.address, info.info.data.privatekey, ReceiverUserName, DaiAmount);
      return {'status': 'ok'};
    }
  },

  parseInput: async function(Input, Discord){

    var userName = '@' + Discord.author.username + '#' + Discord.author.discriminator;
    let message;
    let embed = {
      "description" : "See more info about Burner Bot [here](https://leovoel.github.io/embed-visualizer/)"
    }

    if(Input == undefined){
      embed = this.getMenuEmbed(userName);
      return {
          "embed" : embed
      }
    }

    var inputs = Input[0].split(' ');

    if(inputs[0] == 'balance'){
      var balance = '10000'; // get balance from poa
      message = 'You have ' + balance + 'xDai 👛';
    }else if(inputs[0] == 'send'){
      // a8! jguk.burnerbot send discordUser xDai-Amount
      if(inputs.length != 3){
        message = '**Incorrect Format** \n\nTry something like: ```a8! jguk.burnerbot send jguk#9008 1```'
      }else{
        var result = await this.send(userName, inputs[1], inputs[2], true);

        if(result.status == 'ok')
          message = 'You sent ' + inputs[1] + ' ' + inputs[2] + 'xDai 💸';
        else if (result.status == 'just-created')
          message = 'You have just started - you need some xDai in your account';
        else if (result.status == 'no-balance')
          message = 'You need some xDai in your account';
        else {
          message = result.status;
        }
      }

    }else if(inputs[0] == 'burn'){
      message = 'burn: ' + Input;
    }else if(inputs[0] == 'withdraw'){
      // a8! jguk.burnerbot withdraw address xDai-Amount
      if(inputs.length != 3){
        message = '**Incorrect Format** \n\nTry something like: ```a8! jguk.burnerbot withdraw 0x8f80708Cae88d8487A8A270E7a641f16cEEe472e 1```'
      }else{
        // Send message via POA
        var result = await this.send(userName, inputs[1], inputs[2], false);

        if(result.status == 'ok')
          message = 'You sent ' + inputs[1] + ' ' + inputs[2] + 'xDai 💸';
        else if (result.status == 'just-created')
          message = 'You have just started - you need some xDai in your account';
        else if (result.status == 'no-balance')
          message = 'You need some xDai in your account';
      }

    }else if(inputs[0] == 'info'){
      // a8! jguk.burnerbot send address xDai-Amount

      var userInfo = await this.get_or_set_user_info(userName);

      embed = this.getInfoEmbed(userInfo.info.data.address, userInfo.info.data.privateKey);
    }else{
      embed = this.getMenuEmbed(userName);
    }

    return {
        "content" : message,
        'embed': embed
    }
  },

  getMenuEmbed: function(UserName){

    var embed = {
      "title": "Burner Bot Menu",
      "description": "Hi " + UserName + " welcome to xDai Burner Bot 🔥 🤖 \n\nAn easy way to transfer xDai inspired by [Burner Wallet](https://github.com/austintgriffith/burner-wallet) and built using [autom8](https://gitlab.com/autom8.network/docs). \n\nSee ```a8! jguk.burnerbot balance``` command for details.",
      "url": "https://github.com/johngrantuk/burnerbot",
      "color": 715830,
      "thumbnail": {
        "url": "https://s3-us-west-2.amazonaws.com/steemhunt/production/steemhunt/2019-03-01/b670ec34-XDai.png"
      },
      "fields": [
        {
          "name": "COMMANDS",,
          "value": "Commands are explained below."
        },
        {
          "name": "Balance - how much you got?",
          "value": "a8! jguk.burnerbot balance"
        },
        {
          "name": "Send - spend, spend, spend (remember 1xDai=1$)",
          "value": "a8! jguk.burnerbot send discordUser xDai-Amount\nExample: a8! jguk.burnerbot send @jguk#9008 1"
        },
        {
          "name": "Withdraw - Send some to an external wallet",
          "value": "a8! jguk.burnerbot withdraw address xDai-Amount"
        },
        {
          "name": "Burn - burn baby burn 🔥",
          "value": "a8! jguk.burnerbot balance"
        },
        {
          "name": "Info - What is this? And what's your info?",
          "value": "a8! jguk.burnerbot info"
        }
      ]
    }

    return embed;
  },

  getInfoEmbed: function(Address, PrivateKey){

    var embed = {
      "title": "Burner Bot Info",
      "description": "Stuff about Burner Bot",
      "url": "https://discordapp.com",
      "color": 715830,
      "thumbnail": {
        "url": "https://avatars0.githubusercontent.com/u/4797222?s=460&v=4"
      },
      "fields": [
        {
          "name": "Your Info",
          "value": "Your address: " + Address + "\nYour private key: " + PrivateKey
        },
        {
          "name": "Some things",
          "value": "Private keys are bad. Burning looses everything."
        }
      ]
    }

    return embed;
  },
}
