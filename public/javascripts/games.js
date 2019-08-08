import apiService from './apiservice.js';
import design from './design.js'

export default class Games {
  
  constructor() {
    this.apiS = new apiService();
    this.design = new design();
    this.games =  [];
  }
  
  async init() {
    this.initInterface();
    await this.initGames();
    this.displayGames();
    this.updateGamesInProgress();
  }

  initInterface() {
    document.getElementById('btn-add').addEventListener('click', () => {
      let name = document.getElementById('input-game').value;
      const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (name === "" || format.test(name)) {
        document.getElementById("error-box").style.display = "block";
      } else {
        document.getElementById("error-box").style.display = "none";
        this.apiS.newGame(name).then((res) => {
          let game = res[0];
          this.games.push(game);
          this.design.cardBuilder(game);
          this.initCardClicks(game);
          this.updateGamesInProgress();
        });
      }
    }, false);
  }

  async initGames () {
    this.games = await this.apiS.getGames();
  }

  displayGames () {
    this.games.forEach(game => {
      this.design.cardBuilder(game);
      this.initCardClicks(game);
    });
  }

  initCardClicks (game) {
    // Listen for trash button click
    document.getElementById(`trash-${game.id}`).addEventListener('click', () => {
      console.log(game.id)
      document.getElementById(`card-${game.id}`).remove();
      this.apiS.deleteGame(game.id);
      this.games = this.games.filter(x => x.id !== game.id);
      this.updateGamesInProgress();
    }, false);

    // Listen for card click
    document.getElementById(`card-content-${game.id}`).addEventListener('click', () => {
      let g = this.games.find(x => x.id === game.id);
      if (g.status === 'progress') {
        g.status = 'done';
        this.design.disableCard(game);
      } else {
        g.status = 'progress';
        this.design.enableCard(game);
      }
      this.apiS.updateGame(game.id, g.status);
      this.updateGamesInProgress();
    }, false);
  }

  updateGamesInProgress() {
    let res = this.games.filter(x =>  x.status === 'progress');
    res = res ? res.length : 0;
    this.design.displayNbrGamesInProgress(res);
  }
}