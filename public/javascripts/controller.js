// const apis = require('../services/bfApiService.js');
import apiService from './apiservice.js';
import cardBuilder from './factory.js'

let apiS = new apiService();

const colors = ['red', 'purple', 'grey', 'green', 'orange']
const idcolor = Math.floor(Math.random() * (4 - 0 + 1)) + 0;
const themeColor = `card-theme-${colors[idcolor]}`;
document.getElementById("navbar").classList.add(themeColor);



document.getElementById('btn-add').addEventListener('click', () => {
  let name = document.getElementById('input-game').value;
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  if (name === "" || format.test(name)) {
    document.getElementById("error-box").style.display = "block";
  } else {
    document.getElementById("error-box").style.display = "none";
    apiS.newGame(name).then((res) => {
      cardBuilder(res[0], apiS, themeColor);
    });
  }
  
}, false);
// 
// apiS.updateGame(800, 'done');
// apiS.deleteGame(800);

// const userAction = async () => {
//   const response = await fetch('/api/v1/games');
//   const myJson = await response.json(); //extract JSON from the http response
//   // do something with myJson
//   console.log(myJson);
// }

// userAction();

const displayGames = async () => {
  let resp = await apiS.getGames();
  console.log(resp);
  resp.forEach(game => {
    cardBuilder(game, apiS, themeColor);
  });
}

displayGames();