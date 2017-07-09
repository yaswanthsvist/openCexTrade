import crypto from '../src/services/crypto';
import expect from 'expect'
import deepFreeze from 'deep-freeze';
describe("crypto",()=>{
  const message="The truth is a beautiful and terrible thing, and should therefore be treated with great caution  - Dumbledore.";
  const secret=`delphi is voldmort daughter`;
  let encrypted='',decrypted='';
  beforeEach(()=>{

  })
  it("get30PerVisibleString ",()=>{
    let modified=crypto.get33PerVisibleString("1234567890abcdefghijklmnopqrstuvzxyz");
    expect(modified).toEqual('1**4**7**0**c**f**i**l**o**r**u**x**');
  })
  it("encrypt a message",()=>{
      encrypted = crypto.encryptWithPassword( message , secret );
      expect(encrypted).toNotEqual(undefined);
      expect(encrypted).toNotEqual(null);
      expect(encrypted).toNotEqual('');
      expect(encrypted).toNotEqual(message);
      expect(encrypted).toNotEqual(secret);
  })
  it("decrypt a message",()=>{
      decrypted = crypto.decryptWithPassword( encrypted , secret );
      expect(decrypted).toNotEqual(undefined);
      expect(decrypted).toNotEqual(null);
      expect(decrypted).toNotEqual('');
      expect(decrypted).toNotEqual(encrypted);
      expect(decrypted).toNotEqual(secret);
  });
  it("validate encryptWithPassword & decryptWithPassword",()=>{
      const encry = crypto.encryptWithPassword( message , secret );
      const decry = crypto.decryptWithPassword( encry , secret );
      expect(decry).toEqual(message);
  });
  it("validate valid password ",()=>{
    const apikey = "1234567890abcdefghijklmnopqrstuvzxyz";
    const pwd = "AsrGH@22"
    let modified=crypto.get33PerVisibleString(apikey);
    const encryptedKey = crypto.encryptWithPassword( apikey , pwd );
    const result = crypto.validatePassword( modified , encryptedKey , pwd );
    expect(result).toEqual(true);
  })
  it("invalidate valid password ",()=>{
    const apikey = "1234567890abcdefghijklmnopqrstuvzxyz";
    const pwd = "AsrGH@22";
    const invalidPassword="asrGH@22";
    let modified=crypto.get33PerVisibleString(apikey);
    const encryptedKey = crypto.encryptWithPassword( apikey , pwd );
    const result = crypto.validatePassword( modified , encryptedKey , invalidPassword );
    expect(result).toEqual(false);
  })
  it("SIGNATURE SHOULD be HEX DECIMAL & UPPER CASE",()=>{
    const signature=crypto.generateSignature();
    expect(signature).toMatch(/^[A-Z\d]+$/);
  })
});
describe("encrypt apikey with password",()=>{
  it('set keys', () => {
    expect(1).toEqual(1);
  });
});
