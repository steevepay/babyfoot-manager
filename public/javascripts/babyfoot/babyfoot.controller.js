import apiService from './babyfoot.api.service.js';
import BfDesign from './babyfoot.design.js'

/**
 * @description BabyFoot controller to manage the states and logic of the babyfoot games.
 *
 * @export
 * @class BabyfootController
 */
export default class BabyfootController {
  

  /**
   * Creates an instance of BabyfootController.
   * @param {Websockets} ws Websockets instance to use the broadcast method on events.
   * @param {*} colorTheme Color of the global theme from the MainDesign Class
   * @memberof BabyfootController
   */
  constructor(ws, colorTheme) {
    /**
     * bfdesign: manage/create/update/delete the game cards UI
     */
    this.bfdesign = new BfDesign(colorTheme);
    /**
     * apiS: Service to communicate with the API.
     */
    this.apiS = new apiService();
    /**
     * List of the games fetched by apiS.
     * The source of truth that drives the babyfoot app.
     */
    this.games =  [];
    /** 
     * ws: Websockets instance is used to call the broadcast method upon UI events (on click => broadcast).
     * wsId: Id of the class
     * wsActions: Function names that can be called upon new websocket message.
    */
    this.ws = ws;
    this.wsId = 'wb-message-bf';
    this.wsActions = ['addCard', 'updateCard', 'deleteCard'];
  }
  

  /**
   * @description Initialisation method to called after instanciate the class. Fetch the data and update the view.
   *
   * @memberof BabyfootController
   */
  async init() {
    await this.initGames();
    this.updateGamesInProgress();
    this.initInputAddGame();
  }

  /**
   * Initialise the web page.
   * fetchs the games.
   * clean the page.
   * display the cards and add Events listener.
   * @memberof BabyfootController
   */
  async initGames () {
    this.games = await this.apiS.getGames();
    this.bfdesign.cleanCards();
    this.games.forEach(game => {
      this.bfdesign.cardBuilder(game);
      this.initCardClicks(game);
    });
  }


  /**
   * @description Add event listener on the add button to create new games. Handle bad input by rejecting special characters. If nothing is wrong, the new card is push on the database. The card is created on the view. The creation of the card is broadcast through the websocket to notify other clients.
   * @memberof BabyfootController
   */
  
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

  
  /**
   * @description Initialise listener for click events on cards.
   *
   * @param {*} game babyfoot game object {id: 0, name: 'John vs Théo', status: 'progress/done'}
   * @memberof BabyfootController
   */
  initCardClicks (game) {
    /**  
     * Listener for trash button click.
     * It delete on database by calling the API.
     * Finally broadcast to other websocket clients to notify.
    */
    document.getElementById(`trash-${game.id}`).addEventListener('click', () => {
      this.apiS.deleteGame(game.id).then(() => {
        this.ws.broadcast(this.wsId, 'deleteCard', game.id)
      });
      this.deleteCard(game.id);
    }, false);

    /**  
     * Listener for card click.
     * It update the game status on database by calling the API.
     * Finally broadcast to other websocket clients to notify.
    */
    document.getElementById(`card-content-${game.id}`).addEventListener('click', () => {
      var status = this.updateCard(game.id);
      this.apiS.updateGame(game.id, status).then(() => {
        this.ws.broadcast(this.wsId, 'updateCard', game.id)
      });
      
    }, false);
  }
  
  /**
   * @description Method to update and refesh the number of games playing. Search the cards with status in progress. Then update the UI.
   * 
   * @memberof BabyfootController
   */
  updateGamesInProgress() {
    let res = this.games.filter(x =>  x.status === 'progress');
    res = res ? res.length : 0;
    this.bfdesign.displayNbrGamesInProgress(res);
  }

  /**
   * @description Websocket action method called on new message event. Create the a new game and update the view.
   *
   * @param {*} game babyfoot game object {id: 0, name: 'John vs Théo', status: 'progress/done'}
   * @memberof BabyfootController
   */
  addCard(game) {
    this.games.push(game);
    this.bfdesign.cardBuilder(game);
    this.initCardClicks(game);
    this.updateGamesInProgress();
  }


  /**
   * @description Websocket action method called on new message event. Update the game status and the view.
   *
   * @param {*} id Id of the game.
   * @returns The status updated of the game.
   * @memberof BabyfootController
   */
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


  /**
   * @description Websocket action method called on new message event. Delete the game and update the view.
   *
   * @param {*} id Id of the game.
   * @memberof BabyfootController
   */
  deleteCard(id) {
    document.getElementById(`card-${id}`).remove();
    this.games = this.games.filter(x => x.id !== id);
    this.updateGamesInProgress();
  }
}