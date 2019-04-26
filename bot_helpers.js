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

  sendAddress: async function(UserName, ReceiverAddress, DaiAmount){

    info = await this.get_or_set_user_info(UserName);

    if(info.iscreate == true){
      // won't have any balance
      return {'status': 'just-created'};
    }

    var senderBalance = await poa.getBalance(info.info.data.address);
    if(senderBalance <= 0){
      // won't have any balance
      return {'status': 'no-balance'};
    }
    if(senderBalance <= DaiAmount){
      // won't have any balance
      return {'status': 'not-enough'};
    }

    await poa.sendDai(info.info.data.address, info.info.data.privatekey, ReceiverAddress, DaiAmount);
    return {'status': 'ok'};

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
    if(senderBalance <= DaiAmount){
      // won't have any balance
      return {'status': 'not-enough'};
    }

    if(isUser == true){
      receiver_info = await this.get_or_set_user_address(ReceiverUserName);
      await poa.sendDai(info.info.data.address, info.info.data.privatekey, receiver_info.info.data.address, DaiAmount);
      // would like to add transaction link here
      return {'status': 'ok', 'newreceiver': receiver_info.iscreate};
    }else{
      await poa.sendDai(info.info.data.address, info.info.data.privatekey, ReceiverUserName, DaiAmount);
      return {'status': 'ok'};
    }
  },

  parseInput: async function(Input, Discord){

    var userName = '@' + Discord.author.username + '#' + Discord.author.discriminator;
    let message;
    let embed = {
      "description" : "See more info about Burner Bot [here](https://github.com/johngrantuk/burnerbot/)"
    }

    if(Input == undefined){
      embed = this.getMenuEmbed(userName);
      return {
          "embed" : embed
      }
    }

    var inputs = Input[0].split(' ');

    if(inputs[0] == 'balance'){
      var userInfo = await this.get_or_set_user_info(userName);
      var balance = await poa.getBalance(userInfo.info.data.address);
      message = 'You have ' + balance + 'xDai 👛 \n\n You can view your account https://blockscout.com/poa/dai/.';
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
        else if (result.status == 'not-enough')
          message = "You don't have enough balance to send that amount :tired_face:";
        else {
          message = result.status;
        }
      }

    }else if(inputs[0] == 'burn'){
      var user_hash = poa.hash(userName);
      var newWallet = poa.getRandomWallet();
      var temp_hash = poa.hash('this_will_be_changed_in_the_future_to_be_better');
      var register = await server.registerUser(user_hash, temp_hash, newWallet.address, newWallet.privateKey);
      info.data.address = newWallet.address;

      message = 'Your old wallet has been burned 🔥, your new address is: ' + newWallet.address;

    }else if(inputs[0] == 'withdraw'){
      // a8! jguk.burnerbot withdraw address xDai-Amount
      if(inputs.length != 3){
        message = '**Incorrect Format** \n\nTry something like: ```a8! jguk.burnerbot withdraw 0x8f80708Cae88d8487A8A270E7a641f16cEEe472e 1```'
      }else{
        // Send message via POA
        var result = await this.sendAddress(userName, inputs[1], inputs[2]);

        if(result.status == 'ok')
          message = 'You sent ' + inputs[1] + ' ' + inputs[2] + 'xDai 💸';
        else if (result.status == 'just-created')
          message = 'You have just started - you need some xDai in your account';
        else if (result.status == 'no-balance')
          message = 'You need some xDai in your account';
        else if (result.status == 'not-enough')
          message = "You don't have enough balance to send that amount :tired_face:";
      }

    }else if(inputs[0] == 'info'){
      // a8! jguk.burnerbot send address xDai-Amount

      var userInfo = await this.get_or_set_user_info(userName);

      embed = this.getInfoEmbed(userInfo.info.data.address, userInfo.info.data.privatekey);
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
          "name": "COMMANDS",
          "value": "Commands are explained below."
        },
        {
          "name": "Balance - how much you got?",
          "value": "```a8! jguk.burnerbot balance```"
        },
        {
          "name": "Send - spend, spend, spend (remember 1xDai=1$)",
          "value": "```a8! jguk.burnerbot send discordUser xDai-Amount\nExample: a8! jguk.burnerbot send @jguk#9008 1```"
        },
        {
          "name": "Withdraw - Send some to an external wallet",
          "value": "```a8! jguk.burnerbot withdraw address xDai-Amount```"
        },
        {
          "name": "Burn - baby burn 🔥",
          "value": "This will ditch your account and private key - YOU WILL LOOSE ANY FUNDS IN YOUR CURRENT WALLET! \n```a8! jguk.burnerbot balance```"
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
      "description": "The Burner Bot was made during the The Ethereal Hackathon. The aim was to make something like the [Burner \
      Wallet](https://github.com/austintgriffith/burner-wallet) which provides a quick and easy way to carry and exchange small amounts of spending-crypto using a \
      mobile browser but in this case it's done on Discord using [autom8](https://gitlab.com/autom8.network/docs) technology. \
      Just like the Burner Wallet this version uses xDai Chain for 1:1 with Dai, low gas fees and quick block times.",
      "url": "https://github.com/johngrantuk/burnerbot",
      "color": 715830,
      "thumbnail": {
        "url": "https://avatars0.githubusercontent.com/u/4797222?s=460&v=4"
      },
      "fields": [
        {
          "name": "Your Account Info",
          "value": "Your address: " + Address + "\nYour private key: " + PrivateKey
        },
        {
          "name": "Getting xDai",
          "value": "If you have Dai, you can convert it to xDai via POA Network’s [TokenBridge](https://dai-bridge.poa.network/) that connects Ethereum and xDai Chain."
        },
        {
          "name": "Security - Some things to note",
          "value": "A burner wallet is analogous to cash; you won’t carry too much because it can be lost but it’s astonishingly easy to exchange. \
          \n\nIncreased convenience comes at a security cost – the “burner” part of the wallet’s name exists to remind users that it’s not secure \
          for long-term storage. If you use a Burner Wallet, you should regularly sweep funds into a more secure wallet and \
          burn your Burner Wallet’s private key (you can always make a new one). \
          \n\nIn this version the private key is stored on a [central server](https://github.com/johngrantuk/burnerbotserver) which isn't cool but it was a quick way to get something going and for now this is just for fun! In the future I think something nice could be done to handle private keys using NuCypher tech."
        }
      ]
    }

    return embed;
  },
}
