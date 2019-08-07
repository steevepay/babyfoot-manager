// const apis = require('../services/bfApiService.js');
import apiService from './apiservice.js';

let apiS = new apiService;


document.getElementById('title').addEventListener('click', function() { alert('click') }, false);
// apiS.newGame('John');
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
  
}

displayGames();