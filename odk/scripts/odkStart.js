

$(document).ready(function(){
  console.log("i am here")
  let b64 = window.btoa('aliiqbal88@gmail.com:scienceforthewin');
  console.log(b64);

  let urlFetch = 'https://sitesurvey.panelsolar.si';

  fetch(urlFetch, { headers:{"Authorization":"Basic "+ b64, mode: 'cors'} })
  .then(res=>{
    console.log('res received')
    return res.json();
  }).then(resDump => {
    console.log(resDump);
  })
  //     .then(res => {
  //         console.log('hereitisfetch');
  //         console.log(res.status);
  //         console.log('resFinish');
  //         return res.json();
  //     })

  // console.log('fetching');
  // fetch(urlFetch, { mode: 'cors' })
  //     .then(res => {
  //         console.log('hereitisfetch');
  //         console.log(res.status);
  //         console.log('resFinish');
  //         return res.json();
  //     })

  // let example = fetch("https://httpbin.org/basic-auth/user/passwd", 
  //   {
  //     headers: new Headers( {
  //       "Authorization": 'Basic ' + b64
  //     })
  //   })
  //   .then(response => 
  //     {
  //       if (!response.ok) throw new Error(response.status);
  //       return response.json();
  //     });
  // console.log(example);

  $("p").click(function(){
    $(this).hide();
  });
  

});
