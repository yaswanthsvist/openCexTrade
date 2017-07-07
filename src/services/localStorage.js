export const getStoredState=()=>{
  try{
    const stringifiedState=localStorage.getItem("riceit_state");
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
    console.log(stringifiedState);
    localStorage.setItem("riceit_state",stringifiedState);
  }catch(err){}
}
