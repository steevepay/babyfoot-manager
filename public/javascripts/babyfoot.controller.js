import apiService from './api.service.js';
import BfDesign from './babyfoot.design.js'

export default class BabyfootController {
  
  constructor(ws, colorTheme) {
    this.bfdesign = new BfDesign(colorTheme);
    this.apiS = new apiService();
    this.games =  [];
    /** Websockets */
    this.ws = ws;
    this.wsId = 'wb-message-bf';
    this.wsActions = ['addCard', 'updateCard', 'deleteCard'];
  }
  
  async init() {
    await this.initGames();
    this.updateGamesInProgress();
    this.initInputAddGame();
  }

  async initGames () {
    this.games = await this.apiS.getGames();
    this.bfdesign.cleanCards();
    this.games.forEach(game => {
      this.bfdesign.cardBuilder(game);
      this.initCardClicks(game);
    });
  }

  initInputAddGame() {
    document.getElementById('btn-add').addEventListener('click', () => {
      let name = document.getElementById('input-game').value;
      const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (name === "" || format.test(name)) {
        this.bfdesign.showInputError();
      } else {
        this.bfdesign.hideInputError();
        this.apiS.newGame(name).then((res) => {
          document.getElementById('input-game').value = '';
          let game = res[0];
          this.addCard(game)
          this.ws.broadcast(this.wsId, 'addCard', game);
        });
      }
    }, false);
  }

  initCardClicks (game) {
    // Listen for trash button click
    document.getElementById(`trash-${game.id}`).addEventListener('click', () => {
      this.apiS.deleteGame(game.id).then(() => {
        this.ws.broadcast(this.wsId, 'deleteCard', game.id)
      });
      this.deleteCard(game.id);
    }, false);

    // Listen for card click
    document.getElementById(`card-content-${game.id}`).addEventListener('click', () => {
      var status = this.updateCard(game.id);
      this.apiS.updateGame(game.id, status).then(() => {
        this.ws.broadcast(this.wsId, 'updateCard', game.id)
      });
      
    }, false);
  }

  updateGamesInProgress() {
    let res = this.games.filter(x =>  x.status === 'progress');
    res = res ? res.length : 0;
    this.bfdesign.displayNbrGamesInProgress(res);
  }

  addCard(game) {
    this.games.push(game);
    this.bfdesign.cardBuilder(game);
    this.initCardClicks(game);
    this.updateGamesInProgress();
  }

  updateCard(id) {
    let g = this.games.find(x => x.id === id);
    
    if (g.status === 'progress') {
      g.status = 'done';
      this.bfdesign.disableCard(g);
    } else {
      g.status = 'progress';
      this.bfdesign.enableCard(g);
    }
    this.updateGamesInProgress();
    return g.status;
  }

  deleteCard(id) {
    document.getElementById(`card-${id}`).remove();
    this.games = this.games.filter(x => x.id !== id);
    this.updateGamesInProgress();
  }
}