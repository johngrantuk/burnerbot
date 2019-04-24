var axios = require('axios')

module.exports = {

  getUserAddress: async function(UserName){
    try{
      const response = await axios.get('http://127.0.0.1:8000/userAddress/' + UserName + '/')
      return response;
    }catch(error){
      console.log(error);
      return error;
    }
  },

  registerUser: async function(UserName, Hash, Address, PrivateKey){
    try{
      const response = await axios.post('http://127.0.0.1:8000/register/', {
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
      const response = await axios.get('http://127.0.0.1:8000/userInfo/' + UserName + '/' + Hash + '/')
      return response;
    }catch(error){
      console.log(error);
      return error;
    }
  }
}
