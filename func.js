const fdk=require('@autom8/fdk');
const a8=require('@autom8/js-a8-fdk')
var bot = require('./bot_helpers');


fdk.handle(function(input){
  return input
})


fdk.discord(function(result){

  var output = bot.parseInput(result._inputs, result._discord);

  return output;
})
