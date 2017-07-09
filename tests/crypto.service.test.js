import crypto from '../src/services/crypto';
import expect from 'expect'
import deepFreeze from 'deep-freeze';
describe("crypto",()=>{
  beforeEach(()=>{

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
