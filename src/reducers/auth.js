export const password=(state=null,action)=>{
  switch (action.type) {
    case "SET_PASSWORD":
      return action.password;
      break;
    default:
      return state;
  }
}
const initailAuthState={
  apikey30per:"",
  encryptedKey:"",
  encryptedSecret:"",
  userid:'',
}

const auth=(state=initailAuthState,action)=>{
  switch (action.type) {
    case "SET_SAFE_KEYS":
      return {
        apiKey33per:action.apiKey33per,
        encryptedKey:action.encryptedKey,
        encryptedSecret:action.encryptedSecret,
        userid:action.userid,
      }
      break;
    default:
    return state;
  }
}
export default  auth;
