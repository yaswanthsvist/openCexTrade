const webService=(api,data,method='GET')=>{
  let request = new Request(`https://cex.io/api/${api}`, {
    method,
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
}
export default webService;
