import apiService from './apiservice.js';
import design from './design.js'

export default class Games {
  
  constructor() {
    const protocol = window.location.protocol.includes('https:') ? 'wss:' : 'ws:'
    this.socket = new WebSocket(`${protocol}//${window.location.host}`);
    this.apiS = new apiService();
    this.design = new design();
    this.games =  [];
  }
  
  async init() {
    this.initInterface();
    await this.initGames();
    this.displayGames();
    this.updateGamesInProgress();

    // this.socket.onopen = event => {
      
    // };
    
    this.socket.onmessage = async event => {
      // Handle message
      let message = JSON.parse(event.data);
      if (message.type === 'message-bf')
        if (message.action === 'addGame') {
          this.addCard(message.data)
        } else if (message.action === 'updateGame') {
          this.updateCard(message.id);
        } else if (message.action === 'deleteGame') {
          this.deleteCard(message.id);
        }
    }
    
    this.socket.onerror = error => {
      console.log(`WebSocket error: ${error}`)
    }
  }

  broadcastAddGame(game) {
    var message = {
      'type':'message-bf',
      'action':'addGame',
      'data': game
    }
    this.socket.send(JSON.stringify(message)); 
  }

  broadcastUpdateGame(id) {
    var message = {
      'type':'message-bf',
      'action':'updateGame',
      'id': id
    }
    this.socket.send(JSON.stringify(message)); 
  }

  broadcastDeleteGame(id) {
    var message = {
      'type':'message-bf',
      'action':'deleteGame',
      'id': id
    }
    this.socket.send(JSON.stringify(message)); 
  }

  

  initInterface() {
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
          this.broadcastAddGame(game);
        });
      }
    }, false);
  }

  async initGames () {
    this.games = await this.apiS.getGames();
  }

  displayGames () {
    this.design.cleanCards();
    this.games.forEach(game => {
      this.design.cardBuilder(game);
      this.initCardClicks(game);
    });
  }

  initCardClicks (game) {
    // Listen for trash button click
    document.getElementById(`trash-${game.id}`).addEventListener('click', () => {
      this.apiS.deleteGame(game.id).then(() => {
        this.broadcastDeleteGame(game.id);
      });
      this.deleteCard(game.id);
    }, false);

    // Listen for card click
    document.getElementById(`card-content-${game.id}`).addEventListener('click', () => {
      var status = this.updateCard(game.id);
      this.apiS.updateGame(game.id, status).then(() => {
        this.broadcastUpdateGame(game.id);
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