export default class Design {

  constructor () {
    this.themeColor = '';
    this.initColorTheme();
  }

  initColorTheme() {
    const colors = ['red', 'purple', 'grey', 'green', 'orange']
    const idcolor = Math.floor(Math.random() * (4 - 0 + 1)) + 0;
    this.themeColor = `card-theme-${colors[idcolor]}`;
    document.getElementById("navbar").classList.add(this.themeColor);
    document.getElementById("btn-add").classList.add(`btn-${colors[idcolor]}`);
  }

  disableCard (game) {
    let players = this.getPlayersName(game.name);
    document.getElementById(`card-${game.id}`).classList.add("greyscale");
    document.getElementById(`card-status-${game.id}`).innerHTML = "Finished."
    document.getElementById(`player-one-${game.id}`).data = `https://avatars.dicebear.com/v2/human/${players[0]}.svg?options[mood][]=sad`;
    document.getElementById(`player-two-${game.id}`).data = `https://avatars.dicebear.com/v2/human/${players[1]}.svg?options[mood][]=sad`;
  }

  enableCard (game) {
    let players = this.getPlayersName(game.name);
    document.getElementById(`card-${game.id}`).classList.remove("greyscale");
    document.getElementById(`card-status-${game.id}`).innerHTML = "Game in progress..."
    document.getElementById(`player-one-${game.id}`).data = `https://avatars.dicebear.com/v2/human/${players[0]}.svg?options[mood][]=happy`
    document.getElementById(`player-two-${game.id}`).data = `https://avatars.dicebear.com/v2/human/${players[1]}.svg?options[mood][]=happy`
  }

  cleanCards() {
    var node = document.getElementById("container-list");
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  cardBuilder (game) {
    let players = this.getPlayersName(game.name);

    let card = document.createElement("div"); 
    card.id = `card-${game.id}`;
    card.classList.add("card");
    card.classList.add(this.themeColor);

    let cardcontent = document.createElement("div"); 
    cardcontent.classList.add("card-content");
    cardcontent.id = `card-content-${game.id}`;

    let playerone = document.createElement("object");
    playerone.type = "image/svg+xml";
    playerone.classList.add("icon");
    playerone.id = `player-one-${game.id}`;

    let playertwo = document.createElement("object");
    playertwo.type = "image/svg+xml";
    playertwo.classList.add("icon");
    playertwo.id = `player-two-${game.id}`;

    let cardtext = document.createElement("div");
    let cardtexttitle = document.createElement("div");
    
    cardtexttitle.classList.add("card-title");
    cardtexttitle.innerHTML = game.name;
    let cardtextsubtitle = document.createElement("div");
    cardtextsubtitle.classList.add("card-status");
    cardtextsubtitle.id = `card-status-${game.id}`;
    if (game.status === "progress") {
      cardtextsubtitle.innerHTML = "Game in progress...";
      playertwo.data = `https://avatars.dicebear.com/v2/human/${players[1]}.svg?options[mood][]=happy`
      playerone.data = `https://avatars.dicebear.com/v2/human/${players[0]}.svg?options[mood][]=happy`
    } else {
      cardtextsubtitle.innerHTML = "Finished.";
      playertwo.data = `https://avatars.dicebear.com/v2/human/${players[1]}.svg?options[mood][]=sad`
      playerone.data = `https://avatars.dicebear.com/v2/human/${players[0]}.svg?options[mood][]=sad`
      card.classList.add("greyscale");
    }

    cardcontent.appendChild(playerone)

    cardtext.appendChild(cardtexttitle);
    cardtext.appendChild(cardtextsubtitle);
    cardcontent.appendChild(cardtext);
    
    cardcontent.appendChild(playertwo);  
    
    card.appendChild(cardcontent);

    let trash = document.createElement("img");
    trash.id = `trash-${game.id}`
    trash.src = "/images/delete.png";
    trash.classList.add("btn-delete");
    card.appendChild(trash);

    var listcards = document.getElementById("container-list");
    listcards.insertBefore(card, listcards.firstElementChild);
  }

  getPlayersName (name) {
    let players;
    if (name.includes(' vs ')) {
      players = name.split(' vs ');
    } else {
      players = [name+1,name+2]
    }
    return players;
  }

  displayNbrGamesInProgress(nbr) {
    document.getElementById("nbr-games").innerHTML = `${nbr} games`;
  }

  showInputError() {
    document.getElementById("error-box").style.display = "block";
  }

  hideInputError() {
    document.getElementById("error-box").style.display = "none";
  }
}