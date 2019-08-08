import apiService from './api.service.js';
import design from './design.controller.js'

export default class BabyfootController {
  
  constructor(ws) {
    this.apiS = new apiService();
    this.design = new design();
    this.games =  [];
    this.ws = ws;
    this.wsTypeName = 'wb-message-bf';
    this.wsActions = ['addCard', 'updateCard', 'deleteCard'];
  }
  
  async init() {
    await this.initGames();
    this.updateGamesInProgress();
    this.initInputAddGame();
  }

  async initGames () {
    this.games = await this.apiS.getGames();
    this.design.cleanCards();
    this.games.forEach(game => {
      this.design.cardBuilder(game);
      this.initCardClicks(game);
    });
  }

  initInputAddGame() {
    document.getElementById('btn-add').addEventListener('click', () => {
      let name = document.getElementById('input-game').value;
      const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (name === "" || format.test(name)) {
        this.design.showInputError();
      } else {
        this.design.hideInputError();
        this.apiS.newGame(name).then((res) => {
          document.getElementById('input-game').value = '';
          let game = res[0];
          this.addCard(game)
          this.ws.broadcast(this.wsTypeName, 'addCard', game);
        });
      }
    }, false);
  }

  initCardClicks (game) {
    // Listen for trash button click
    document.getElementById(`trash-${game.id}`).addEventListener('click', () => {
      this.apiS.deleteGame(game.id).then(() => {
        this.ws.broadcast(this.wsTypeName, 'deleteCard', game.id)
      });
      this.deleteCard(game.id);
    }, false);

    // Listen for card click
    document.getElementById(`card-content-${game.id}`).addEventListener('click', () => {
      var status = this.updateCard(game.id);
      this.apiS.updateGame(game.id, status).then(() => {
        this.ws.broadcast(this.wsTypeName, 'updateCard', game.id)
      });
      
    }, false);
  }

  updateGamesInProgress() {
    let res = this.games.filter(x =>  x.status === 'progress');
    res = res ? res.length : 0;
    this.design.displayNbrGamesInProgress(res);
  }

  addCard(game) {
    this.games.push(game);
    this.design.cardBuilder(game);
    this.initCardClicks(game);
    this.updateGamesInProgress();
  }

  updateCard(id) {
    let g = this.games.find(x => x.id === id);
    
    if (g.status === 'progress') {
      g.status = 'done';
      this.design.disableCard(g);
    } else {
      g.status = 'progress';
      this.design.enableCard(g);
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