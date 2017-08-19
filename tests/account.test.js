import account from './../src/reducers/account';
import expect from 'expect'
import deepFreeze from 'deep-freeze';
const expectedDefaultState={
  balance:{
    "USD":1200,
    "BTC":0,
    "ETH":0,
  },
  orders:[],
  transactions:[],
}
describe("balance",()=>{
  it('UPDATE_BALANCE', () => {
    let action={
      "type":"UPDATE_BALANCE",
      'USD':1235,
      'BTC':0.1,
      "ETH" : 1,
    }
    let initialState=account(undefined,{type:""});
    deepFreeze(initialState);
    let newState=account(initialState,action);
    expectedNewState={...expectedDefaultState,balance:{USD:1235,BTC:0.1,ETH:1}};
    expect(newState).toEqual(expectedNewState);
  });
  it('RESET_BALANCE', () => {
    let action={
      "type":"RESET_BALANCE",
    }
    let initialState=account(undefined,{type:""});
    deepFreeze(initialState);
    let newState=account(initialState,action);
    expectedNewState={...expectedDefaultState,balance:{USD:1200,BTC:0,ETH:0}}
    expect(newState).toEqual(expectedNewState);
  });
});
describe("orders",()=>{
  it('CANCEL_ALL_ORDERS', () => {
    let action={
      "type":"CANCEL_ALL_ORDERS",
    }
    let initialState=account(undefined,{type:""});
    initialState.orders=[{}];
    deepFreeze(initialState);
    let newState=account(initialState,action);
    expectedNewState={...expectedDefaultState};
    expect(newState).toEqual(expectedNewState);
  });
  it('CANCEL_ORDER begining', () => {
    let action={
      "type":"CANCEL_ORDER",
      index:0
    }
    let initialState={...expectedDefaultState,
      orders:[
      {
        id:12322222,
        type : "bid",
        at : 4000,
        for : 500,//usd dollars
        serviceFee :1,//0.2% of 500
        volume : 0.125,//BTC
        from: "USD",
        to : "BTC",
      },
      {
        id:12322245,
        type : "bid",
        at : 4000,
        for : 1000,//usd dollars
        serviceFee :2,//0.2% of 500
        volume : 0.25,//BTC
        from: "USD",
        to : "BTC",
      },
      {
        id:12322285,
        type : "bid",
        at : 4000,
        for : 1000,//usd dollars
        serviceFee :2,//0.2% of 500
        volume : 0.25,//BTC
        from: "USD",
        to : "BTC",
      },
    ]
    };
    let expectedNewState={...expectedDefaultState,
      orders:[
      {
        id:12322245,
        type : "bid",
        at : 4000,
        for : 1000,//usd dollars
        serviceFee :2,//0.2% of 500
        volume : 0.25,//BTC
        from: "USD",
        to : "BTC",
      },
      {
        id:12322285,
        type : "bid",
        at : 4000,
        for : 1000,//usd dollars
        serviceFee :2,//0.2% of 500
        volume : 0.25,//BTC
        from: "USD",
        to : "BTC",
      },
    ]
    };

    deepFreeze(initialState);
    let newState=account(initialState,action);
    expect(newState).toEqual(expectedNewState);
  });
  it('CANCEL_ORDER middle', () => {
    let action={
      "type":"CANCEL_ORDER",
      index:1
    }
    let initialState={...expectedDefaultState,
      orders:[
      {
        id:12322222,
        type : "bid",
        at : 4000,
        for : 500,//usd dollars
        serviceFee :1,//0.2% of 500
        volume : 0.125,//BTC
        from: "USD",
        to : "BTC",
      },
      {
        id:12322245,
        type : "bid",
        at : 4000,
        for : 1000,//usd dollars
        serviceFee :2,//0.2% of 500
        volume : 0.25,//BTC
        from: "USD",
        to : "BTC",
      },
      {
        id:12322285,
        type : "bid",
        at : 4000,
        for : 1000,//usd dollars
        serviceFee :2,//0.2% of 500
        volume : 0.25,//BTC
        from: "USD",
        to : "BTC",
      },
    ]
    };
    let expectedNewState={...expectedDefaultState,
      orders:[
        {
          id:12322222,
          type : "bid",
          at : 4000,
          for : 500,//usd dollars
          serviceFee :1,//0.2% of 500
          volume : 0.125,//BTC
          from: "USD",
          to : "BTC",
        },
      {
        id:12322285,
        type : "bid",
        at : 4000,
        for : 1000,//usd dollars
        serviceFee :2,//0.2% of 500
        volume : 0.25,//BTC
        from: "USD",
        to : "BTC",
      },
    ]
    };

    deepFreeze(initialState);
    let newState=account(initialState,action);
    expect(newState).toEqual(expectedNewState);
  });
  it('CANCEL_ORDER end', () => {
    let action={
      "type":"CANCEL_ORDER",
      index:2
    }
    let initialState={...expectedDefaultState,
      orders:[
      {
        id:12322222,
        type : "bid",
        at : 4000,
        for : 500,//usd dollars
        serviceFee :1,//0.2% of 500
        volume : 0.125,//BTC
        from: "USD",
        to : "BTC",
      },
      {
        id:12322245,
        type : "bid",
        at : 4000,
        for : 1000,//usd dollars
        serviceFee :2,//0.2% of 500
        volume : 0.25,//BTC
        from: "USD",
        to : "BTC",
      },
      {
        id:12322285,
        type : "bid",
        at : 4000,
        for : 1000,//usd dollars
        serviceFee :2,//0.2% of 500
        volume : 0.25,//BTC
        from: "USD",
        to : "BTC",
      },
    ]
    };
    let expectedNewState={...expectedDefaultState,
      orders:[
        {
          id:12322222,
          type : "bid",
          at : 4000,
          for : 500,//usd dollars
          serviceFee :1,//0.2% of 500
          volume : 0.125,//BTC
          from: "USD",
          to : "BTC",
        },
        {
          id:12322245,
          type : "bid",
          at : 4000,
          for : 1000,//usd dollars
          serviceFee :2,//0.2% of 500
          volume : 0.25,//BTC
          from: "USD",
          to : "BTC",
        },
    ]
    };

    deepFreeze(initialState);
    let newState=account(initialState,action);
    expect(newState).toEqual(expectedNewState);
  });
  it('ADD_ORDER', () => {
    let action={
      "type":"ADD_ORDER",
      order : {
        id:12322222,
        type : "bid",
        at : 4000,
        for : 500,//usd dollars
        serviceFee :1,//0.2% of 500
        volume : 0.125,//BTC
        from: "USD",
        to : "BTC",
      }
    }
    let initialState=account(undefined,{type:""});
    deepFreeze(initialState);
    let newState=account(initialState,action);
    expectedNewState={...expectedDefaultState,
      orders:[{
        id:12322222,
        type : "bid",
        at : 4000,
        for : 500,//usd dollars
        serviceFee :1,//0.2% of 500
        volume : 0.125,//BTC
        from: "USD",
        to : "BTC",
      }]
    };
    expect(newState).toEqual(expectedNewState);
  });
  it('UPDATE_ORDER', () => {
    let action={
      "type":"UPDATE_ORDER",
      index:0,
      order : {
        id:12322222,
        type : "bid",
        at : 4000,
        for : 500,//usd dollars
        serviceFee :1,//0.2% of 500
        volume : 0.125,//BTC
        from: "USD",
        to : "BTC",
      }
    }
    let initialState=account(undefined,{type:""});
    deepFreeze(initialState);
    let newState=account(initialState,action);
    expectedNewState={...expectedDefaultState,
      orders:[{
        id:12322222,
        type : "bid",
        at : 4000,
        for : 500,//usd dollars
        serviceFee :1,//0.2% of 500
        volume : 0.125,//BTC
        from: "USD",
        to : "BTC",
      }]
    };
    expect(newState).toEqual(expectedNewState);
  });
});
