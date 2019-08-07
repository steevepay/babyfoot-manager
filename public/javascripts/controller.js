// const apis = require('../services/bfApiService.js');
import apiService from './apiservice.js';

let apiS = new apiService();


document.getElementById('title').addEventListener('click', () => { alert('click') }, false);
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
  resp.forEach(game => {

    const theme = ['red', 'purple', 'grey', 'green']
    var idcolor = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
    console.log(idcolor);


    let players;
    if (game.name.includes(' vs ')) {
      players = game.name.split(' vs ');
    } else {
      players = [game.name+1,game.name+2]
    }

    let card = document.createElement("div"); 
    card.id = `card-${game.id}`;
    card.classList.add("card");
    card.classList.add(`card-theme-${theme[idcolor]}`);
    
    let cardcontent = document.createElement("div"); 
    cardcontent.classList.add("card-content");
  
    let playerone = document.createElement("object");
    playerone.type = "image/svg+xml";
    playerone.classList.add("icon");
    playerone.data = `https://avatars.dicebear.com/v2/human/${players[0]}.svg?options[mood][]=happy`
    cardcontent.appendChild(playerone)
  
    let playertwo = document.createElement("object");
    playertwo.type = "image/svg+xml";
    playertwo.classList.add("icon");
    playertwo.data = `https://avatars.dicebear.com/v2/human/${players[1]}.svg?options[mood][]=happy`
    
    let cardtext = document.createElement("div");
    let cardtexttitle = document.createElement("div");
    cardtexttitle.classList.add("card-title");
    cardtexttitle.innerHTML = game.name;
    let cardtextsubtitle = document.createElement("div");
    cardtextsubtitle.classList.add("card-status");
    if (game.status === "progress") {
      cardtextsubtitle.innerHTML = "Game in progress...";
    } else {
      cardtextsubtitle.innerHTML = "Finished.";
      card.classList.add("greyscale");
    }
  
    cardtext.appendChild(cardtexttitle);
    cardtext.appendChild(cardtextsubtitle);
  
    cardcontent.appendChild(cardtext);
    cardcontent.appendChild(playertwo);  
    card.appendChild(cardcontent);
  
    let trash = document.createElement("img");
    trash.src = "/images/delete.png";
    trash.classList.add("btn-delete");
    card.appendChild(trash);
    
    var listcards = document.getElementById("container-list");
    listcards.appendChild(card);
    
    cardcontent.addEventListener('click', () => {
      if(!card.classList.contains("greyscale")) { 
        card.classList.add("greyscale");
        cardtextsubtitle.innerHTML = "Finished."
        console.log(card.id);
        apiS.updateGame(card.id.split('-')[1], 'done');
      } else {
        card.classList.remove("greyscale");
        cardtextsubtitle.innerHTML = "Game in progress..."
        console.log(card.id);
        apiS.updateGame(card.id.split('-')[1], 'progress');
      }
     }, false);

     trash.addEventListener('click', () => {
      card.remove();
      console.log(card.id);
      apiS.deleteGame(card.id.split('-')[1]);
     }, false);
  });
 
}

displayGames();