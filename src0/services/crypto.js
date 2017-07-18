import {hmacSHA512} from 'crypto-js/hmac-sha512';
import CryptoJS from 'crypto-js';


/**
     * @return
     * Generates a Signature is a HMAC-SHA256 encoded message containing: nonce , user ID and API key. The HMAC-SHA256 code must be generated using a secret key that was generated with your API key. This code must be converted to it's hexadecimal representation( 64 uppercase characters ) .
     * @param nonce .
     *Nonce is a regular integer number. It must be increasing with every request you make. Read more about it here. Example: if you set nonce to 1 in your first request , you must set it to at least 2 in your second request. You are not required to start with 1. A common practice is to use unix time for that parameter.
     * @param userID = '' , apikey = '' , apisecret = ''.
     *To get an API key , apisecret , userid go to CEX.IO /profile -> API Access Tab. Set permissions and click "Generate key".
     * @example ( Python ) :
         message = nonce + userID + api_key
         signature = hmac.new( API_SECRET , msg = message , digestmod = hashlib.sha256 ) .hexdigest( ) .upper( )
*/
const generateSignature = ( nonce = ( new Date( )  ) .getTime( ) , userID = '' , apikey = '' , apisecret = '' ) =>{
  let message = nonce+ userID + apikey
  return CryptoJS.HmacSHA256( message , apisecret ) .toString( CryptoJS.enc.Hex ) .toUpperCase( ) ;
}

const get33PerVisibleString = ( str ) => {
    let temp = '';
    for(let index in str){
      temp += ( index%3 ) ? '*' : str[ index ];
    }
    return temp;
}
const encryptWithPassword = ( msg = '' , password = '' ) =>{
    return CryptoJS.AES.encrypt( msg , password ) ;
}
const decryptWithPassword = ( msg = '' , password = '' ) =>{
    return CryptoJS.AES.decrypt( msg , password )
            .toString( CryptoJS.enc.Utf8 ) ;
}
const getNewAuthParams = ( userID = '' , encryptedKey = '' , encryptedSecret = '' , password = '' ) =>{
  const apikey = decryptWithPassword( encryptedKey , password ) ;
  const apisecret = decryptWithPassword( encryptedSecret , password ) ;
  const nonce = ( new Date( )  ) .getTime( ) ;
  const signature = generateSignature( nonce , userID , apikey , apisecret ) ;
  return {
    nonce , signature , apikey
  }
}
const validatePassword = ( originalKey33perVissible , encryptedKey , password ) => {
  const decryptedKey = decryptWithPassword( encryptedKey , password );
  const decrypted33Vissiblekey = get33PerVisibleString( decryptedKey );
  if( decrypted33Vissiblekey === originalKey33perVissible ){
    return true;
  }else{
    return false;
  }
}
const crypto = {
  get33PerVisibleString,
  encryptWithPassword,
  decryptWithPassword,
  generateSignature ,
  getNewAuthParams,
  validatePassword,
}
export default crypto;
