const fdk=require('@autom8/fdk');
const a8=require('@autom8/js-a8-fdk')
var poa = require('./poa_helpers');

fdk.handle(function(input){

  let wallet = poa.getRandomWallet();

  let pk = wallet.address;

  var id = ""

  if (input.id){
    id = input.id
  }

  return {'message': id + ' PK: ' + pk}
})


fdk.discord(function(result){
  let wallet = poa.getRandomWallet();

  let pk = wallet.address;
  // let pk = '?'

    return {
        "content" : result.message + " ok? " + result._discord,
        "embed" : {
          "description" : "[Click here](https://leovoel.github.io/embed-visualizer/) for an example of what you can do in Discord responses."
        }
    }
})
