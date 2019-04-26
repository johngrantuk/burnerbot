var axios = require('axios')

const server = 'https://burnerserver.herokuapp.com/';
// http://127.0.0.1:8000/

module.exports = {

  getUserAddress: async function(UserName){
    try{
      const response = await axios.get('https://burnerserver.herokuapp.com/userAddress/' + UserName + '/')
      return response;
    }catch(error){
      console.log(error);
      return error;
    }
  },

  registerUser: async function(UserName, Hash, Address, PrivateKey){
    try{
      const response = await axios.post('https://burnerserver.herokuapp.com/register/', {
        username: UserName,
        hash: Hash,
        address: Address,
        privatekey: PrivateKey
      })

      return response;
    }catch(error){
      console.log(error);
      return error;
    }
  },

  getUserInfo: async function(UserName, Hash){
    try{
      const response = await axios.get('https://burnerserver.herokuapp.com/userInfo/' + UserName + '/' + Hash + '/')
      return response;
    }catch(error){
      console.log(error);
      return error;
    }
  }
}
