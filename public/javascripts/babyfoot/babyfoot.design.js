
/**
 * Manage and update the babyfoot manager view.
 *
 * @export
 * @class BfDesign
 */
export default class BfDesign {


  /**
   * Creates an instance of BfDesign and initialise colors.
   * @param {String} colorTheme
   * @memberof BfDesign
   */
  constructor (colorTheme) {
    this.colorTheme = colorTheme;
    this.classColor = `theme-${colorTheme}`;
    this.initColorTheme();
  }


  /**
   * @description Initialise colors on the view.
   *
   * @memberof BfDesign
   */
  initColorTheme() {
    document.getElementById("navbar").classList.add(this.classColor);
    document.getElementById("btn-add").classList.add(`btn-${this.colorTheme}`);
  }


  /**
   * @description Disable a card game: Change the text to 'finished', update avatars and greyscale.
   *
   * @param {Object} game Babyfoot game object.
   * @memberof BfDesign
   */
  disableCard (game) {
    let players = this.getPlayersName(game.name);
    document.getElementById(`card-${game.id}`).classList.add("greyscale");
    document.getElementById(`card-status-${game.id}`).innerHTML = "Finished."
    document.getElementById(`player-one-${game.id}`).data = `https://avatars.dicebear.com/v2/human/${players[0]}.svg?options[mood][]=sad`;
    document.getElementById(`player-two-${game.id}`).data = `https://avatars.dicebear.com/v2/human/${players[1]}.svg?options[mood][]=sad`;
  }


  /**
   * @description Enable a card game: Change the text to 'Game in progress', update avatars and greyscale.
   *
   * @param {Object} game Babyfoot game object.
   * @memberof BfDesign
   */
  enableCard (game) {
    let players = this.getPlayersName(game.name);
    document.getElementById(`card-${game.id}`).classList.remove("greyscale");
    document.getElementById(`card-status-${game.id}`).innerHTML = "Game in progress..."
    document.getElementById(`player-one-${game.id}`).data = `https://avatars.dicebear.com/v2/human/${players[0]}.svg?options[mood][]=happy`
    document.getElementById(`player-two-${game.id}`).data = `https://avatars.dicebear.com/v2/human/${players[1]}.svg?options[mood][]=happy`
  }


  /**
   * @description Remove all the card on the web page.
   *
   * @memberof BfDesign
   */
  cleanCards() {
    var node = document.getElementById("container-list");
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }


  /**
   * Create a new card on the view.
   *
   * @param {Object} game Babyfoot game object.
   * @memberof BfDesign
   */
  cardBuilder (game) {
    let players = this.getPlayersName(game.name);

    let card = document.createElement("div"); 
    card.id = `card-${game.id}`;
    card.classList.add("card");
    card.classList.add(this.classColor);

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


  /**
   * @description Create an array of the players names.
   *
   * @param {String} name Name inside the input.
   * @returns
   * @memberof BfDesign
   */
  getPlayersName (name) {
    let players;
    if (name.includes(' vs ')) {
      players = name.split(' vs ');
    } else {
      players = [name+1,name+2]
    }
    return players;
  }


  /**
   * @description display the number of games in progress.
   *
   * @param {Number} nbr Number of games in progress.
   * @memberof BfDesign
   */
  displayNbrGamesInProgress(nbr) {
    document.getElementById("nbr-games").innerHTML = `${nbr} games`;
  }



  /**
   * @description Display error message.
   *
   * @memberof BfDesign
   */
  showInputError() {
    document.getElementById("error-box").style.display = "block";
  }


  /**
   * @description Hide error message.
   *
   * @memberof BfDesign
   */
  hideInputError() {
    document.getElementById("error-box").style.display = "none";
  }
}