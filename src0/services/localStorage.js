export const getStoredState=()=>{
  try{
    const stringifiedState=localStorage.getItem("cex_state");
    if(stringifiedState===null){
      return undefined;
    }
    return JSON.parse(stringifiedState);
  }catch(err){
    return undefined;
  }
}
export const storeState=(state)=>{
  try{
    const stringifiedState=JSON.stringify(state);
    localStorage.setItem("cex_state",stringifiedState);
  }catch(err){}
}
