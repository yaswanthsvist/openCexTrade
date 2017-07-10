const webService={
  post:(api='',data={})=>{
    let request = new Request(`https://cex.io/api/${api}`, {
      method:"POST",
      mode: 'cors',
      redirect: 'follow',
      body:JSON.stringify({data}),
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
    return fetch(request).then(function(data) {
        return data.json();
    })
  },
  get:(api='')=>{
    console.log(api);
    let request = new Request(`https://cex.io/api/${api}`, {
      method:"GET",
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
    return fetch(request).then(function(data) {
        return data.json();
    })
  }
}
export default webService;
