export default (game, apiS, themeColor) => {

  let players;
  if (game.name.includes(' vs ')) {
    players = game.name.split(' vs ');
  } else {
    players = [game.name+1,game.name+2]
  }

  let card = document.createElement("div"); 
  card.id = `card-${game.id}`;
  card.classList.add("card");
  card.classList.add(themeColor);
  
  
  let cardcontent = document.createElement("div"); 
  cardcontent.classList.add("card-content");

  let playerone = document.createElement("object");
  playerone.type = "image/svg+xml";
  playerone.classList.add("icon");
  // playerone.data = `https://avatars.dicebear.com/v2/human/${players[0]}.svg?options[mood][]=happy`
  cardcontent.appendChild(playerone)

  let playertwo = document.createElement("object");
  playertwo.type = "image/svg+xml";
  playertwo.classList.add("icon");
  // playertwo.data = `https://avatars.dicebear.com/v2/human/${players[1]}.svg?options[mood][]=happy`
  
  let cardtext = document.createElement("div");
  let cardtexttitle = document.createElement("div");
  cardtexttitle.classList.add("card-title");
  cardtexttitle.innerHTML = game.name;
  let cardtextsubtitle = document.createElement("div");
  cardtextsubtitle.classList.add("card-status");
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
  listcards.insertBefore(card, listcards.firstElementChild);
  
  cardcontent.addEventListener('click', () => {
    if(!card.classList.contains("greyscale")) { 
      card.classList.add("greyscale");
      cardtextsubtitle.innerHTML = "Finished."
      playertwo.data = `https://avatars.dicebear.com/v2/human/${players[1]}.svg?options[mood][]=sad`
      playerone.data = `https://avatars.dicebear.com/v2/human/${players[0]}.svg?options[mood][]=sad`
      console.log(card.id);
      apiS.updateGame(card.id.split('-')[1], 'done');
    } else {
      card.classList.remove("greyscale");
      cardtextsubtitle.innerHTML = "Game in progress..."
      playertwo.data = `https://avatars.dicebear.com/v2/human/${players[1]}.svg?options[mood][]=happy`
      playerone.data = `https://avatars.dicebear.com/v2/human/${players[0]}.svg?options[mood][]=happy`
      console.log(card.id);
      apiS.updateGame(card.id.split('-')[1], 'progress');
    }
   }, false);

   trash.addEventListener('click', () => {
    card.remove();
    console.log(card.id);
    apiS.deleteGame(card.id.split('-')[1]);
   }, false);
}