import React from 'react';
import HandCards from './HandCards';
import './DeckBoard.css';
import Board from './Board';
import HiddenCards from './HiddenCards';
import _ from 'lodash';

class DeckBoard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      playerTurn: true, // initialise playerTurn à true pour débuter la partie avec le tour du joueur. Deus Sex Machina est généreux.
      heroesChosen: this.props.heroesChosen, // initialise les héros choisis par le joueur dans le Deck Choice
      cardsAvalaibleForIA: []
    };
  }

  componentDidMount () {
    this.randomizeHeroesChosenPlayer();
    this.randomizeIaDeck();
    window.setTimeout(() => this.randomizeHeroesChosenIa(), 200);
  }

  componentWillUnmount () {
    this.setState({ heroesChosen: [] });
  }

  handleHandToBoard = (heroeName) => {
    const newDeck = this.state.heroesChosen.slice().map(heroe => {
      if (heroe.name === heroeName) {
        return { ...heroe, position: 'board' };
      } else {
        return heroe;
      }
    });
    this.setState({ heroesChosen: newDeck });
  }

  handleHandToBoardIa = () => {
    const newIaDeck = this.state.cardsAvalaibleForIA.slice();
    const randomNumber = Math.floor(Math.random() * newIaDeck.filter(heroe => heroe.position === 'hand').length);
    if(newIaDeck.filter(heroe => heroe.position === 'hand').length !== 0){
      newIaDeck.filter(heroe => heroe.position === 'hand')[randomNumber].position = 'board';
    }
    this.setState({ cardsAvalaibleForIA: newIaDeck });
  }

randomizeHeroesChosenPlayer = () => {
  let newHeroesChosen = this.state.heroesChosen.slice();
  newHeroesChosen = _.shuffle(newHeroesChosen);

  for (let i = 0; i < 4; i++) {
    if (newHeroesChosen[i] !== undefined) {
      newHeroesChosen[i].position = 'hand';
    }
  }
  this.setState({ heroesChosen: newHeroesChosen });
}

randomizeHeroesChosenIa = () => {
  let newcardsAvalaibleForIA = this.state.cardsAvalaibleForIA.slice();
  newcardsAvalaibleForIA = _.shuffle(newcardsAvalaibleForIA);

  for (let i = 0; i < 3; i++) {
    if (newcardsAvalaibleForIA[i] !== undefined) {
      newcardsAvalaibleForIA[i].position = 'hand';
    }
  }
  this.setState({ cardsAvalaibleForIA: newcardsAvalaibleForIA });
}

  randomizeIaDeck = () => {
    const heroes = _.shuffle(this.props.heroes);
    let IaDeckPower = 0;
    const cardsAvalaibleForIA = this.state.cardsAvalaibleForIA.slice();
    for (let i = 0; i < this.props.heroes.length; i++) {
      if (IaDeckPower <= this.props.maxPower) {
        if (heroes[i].power > this.props.maxPower - IaDeckPower) {
        } else {
          cardsAvalaibleForIA.push({ ...heroes[i], position: 'deck', iaDeck: true });
          IaDeckPower += heroes[i].power;
        }
      } else {
        break;
      }
    }
    this.setState({ cardsAvalaibleForIA });
  }

  handleDrawPlayer = () => {
    const newHeroesChosen = this.state.heroesChosen.slice();
    if (newHeroesChosen.filter(heroe => heroe.position === 'deck').length !== 0) { // (Flo) condition si clé position dans l'objet héro est 'deck' et que le la longueur du tableau n'est pas égal à 0
      const randomNumber = Math.floor(Math.random() * newHeroesChosen.filter(heroe => heroe.position === 'deck').length); // (Flo) set const randomNumber : pioche aléatoire dans liste d'héro choisie ssi la clé position est à 'deck
      newHeroesChosen.filter(heroe => heroe.position === 'deck')[randomNumber].position = 'hand'; // (Flo) si condition est true : filter des héros ayant la valeur de la clé position à 'deck' à la position correspondant au randomNumber
      this.setState({ heroesChosen: newHeroesChosen });
    }
  }

  handleDrawIa = () => {
    const newcardsAvalaibleForIA = this.state.cardsAvalaibleForIA.slice();
    if (newcardsAvalaibleForIA.filter(heroe => heroe.position === 'deck').length !== 0) { // (Flo) condition si clé position dans l'objet héro est 'deck' et que le la longueur du tableau n'est pas égal à 0
      const randomNumber = Math.floor(Math.random() * newcardsAvalaibleForIA.filter(heroe => heroe.position === 'deck').length); // (Flo) set const randomNumber : pioche aléatoire dans liste d'héro choisie ssi la clé position est à 'deck
      newcardsAvalaibleForIA.filter(heroe => heroe.position === 'deck')[randomNumber].position = 'hand'; // (Flo) si condition est true : filter des héros ayant la valeur de la clé position à 'deck' à la position correspondant au randomNumber
      this.setState({ cardsAvalaibleForIA: newcardsAvalaibleForIA });
    }
  }

  attackCardIa = () => {
    const newDeckIa = this.state.cardsAvalaibleForIA.slice();
    const newHeroesChosen = this.state.heroesChosen.slice();
    for (let i = 0; i < newDeckIa.filter(heroe => heroe.position === 'board').length; i++) { // boucle pour chaque carte sur le board de l'IA
      window.setTimeout(() => {
        const cardBoardIa = newDeckIa.filter(heroe => heroe.position === 'board');
        const cardBoardPlayer = newHeroesChosen.filter(heroe => heroe.position === 'board' && !heroe.deadOnBoard);
        const randomNumber = Math.floor(Math.random() * cardBoardPlayer.length);
        if (cardBoardPlayer.length !== 0) {
          cardBoardIa[i].hp -= cardBoardPlayer[randomNumber].atk; // enlève la vie de la carte de l'IA
          cardBoardPlayer[randomNumber].hp -= cardBoardIa[i].atk; // enlève la vie de la carte du joueur
          if (cardBoardIa[i].hp <= 0) { // si les hp de la carte de l'IA est inferieur ou égal à 0, enleve la carte du board
            cardBoardIa[i].deadOnBoard = true;
          }
          if (cardBoardPlayer[randomNumber].hp <= 0) { // si les hp de la carte de du joueur est inferieur ou égal à 0, enleve la carte du board
            cardBoardPlayer[randomNumber].deadOnBoard = true;
          }
        }
        this.setState({ cardsAvalaibleForIA: newDeckIa, heroesChosen: newHeroesChosen });
      }, 1000 * i);
    }
  }

  killCards = () => {
    const newDeckIa = this.state.cardsAvalaibleForIA.slice();
    const newHeroesChosen = this.state.heroesChosen.slice();
    newDeckIa.map(heroe => { // si valeur deadOnBoard = true, changement de la clé position à 'dead' pour les cartes de l'IA.
      if (heroe.deadOnBoard) {
        heroe.position = 'dead';
        heroe.deadOnBoard = false;
      }
    });
    newHeroesChosen.map(heroe => { // si valeur deadOnBoard = true, changement de la clé position à 'dead' pour les cartes du joueur
      if (heroe.deadOnBoard) {
        heroe.position = 'dead';
        heroe.deadOnBoard = false;
      }
    });
    this.setState({ cardsAvalaibleForIA: newDeckIa, heroesChosen: newHeroesChosen });
  }

  handleIaTurn = () => {
    const iaBoardLength = this.state.cardsAvalaibleForIA.filter(heroe => heroe.position === 'board').length + 1;
    const playerBoardLength = this.state.heroesChosen.filter(heroe => heroe.position === 'board').length;
    this.setState({ playerTurn: false }); // set le state de playerTurn à false pour permettre à l'IA de débloquer ses actions.
    const attackTime = 1000 * (iaBoardLength > playerBoardLength ? playerBoardLength : iaBoardLength); // set const attackTime pour déterminer le temps d'attaque à ajouter entre chaques cartes supplémentaire sur le board de l'IA.
    window.setTimeout(() => this.handleDrawIa(), 1000); // L'IA pioche sa première carte et attend pour effectuer l'action suivante. Appel à la fonction vers la ligne 82.
    window.setTimeout(() => this.handleHandToBoardIa(), 4000); // L'IA place sa carte sur le board et attend. Appel à la fonction vers la ligne 49.
    window.setTimeout(() => this.attackCardIa(), 5000); // Lance la procédure d'attaque des cartes de l'IA vers les cartes du joueur et attend. Appel à la fonction vers la ligne 91.
    window.setTimeout(() => this.killCards(), 6000 + attackTime); // Lance la procédure des cartes qui sont éliminées pour les mettre en position 'dead' et attend.
    window.setTimeout(() => this.setState({ playerTurn: true }), 6000 + attackTime); // set de playerTurn à true et attend.
    window.setTimeout(() => this.handleDrawPlayer(), 6000 + attackTime); // fait piocher la carte au joueur et attend.
  }

  render () {
    return (
      <div className='deckBoard'>
        <div className='leftBoardContainer'>
          <a className='button-config' id='button-rageQuit' href='http://localhost:3000/'>Rage Quit</a> {/* https://cards-battle-of-heroes-us11.netlify.app */}
          <aside className='dead-card-container'> {/* Cimetiere */}
            <p>je suis mort</p>
          </aside>
        </div>
        <div className='centerBoardContainer'> {/* Board Total */}
          <div className='iahand'> {/* hand of computer */}
            <HandCards heroesChosen={this.state.cardsAvalaibleForIA} randomizeHeroesChosen={this.randomizeHeroesChosen} />
          </div>
          <div className='boardContainer'>
            <div className='boardia'> {/* board of computer */}
              <Board heroesChosen={this.state.cardsAvalaibleForIA} />
            </div>
            <div className='boardPlayer1'> {/* board of Player1 */}
              <Board heroesChosen={this.state.heroesChosen} />
            </div>
          </div>
          <div className='player1hand'> {/* hand of Player1 */}
            <HandCards heroesChosen={this.state.heroesChosen} onHandleHandToBoard={this.handleHandToBoard} playerTurn={this.state.playerTurn} />
          </div>
        </div>
        <div className='rightBoardContainer'> {/* right board container : decks, timer, "End Turn" button, pseudos */}
          <div className='deckia'>
            <HiddenCards deck={this.state.cardsAvalaibleForIA} />
          </div>
          <div className='timerAndEndTurn'>
            <p>59 s</p>
            <button onClick={this.state.playerTurn ? this.handleIaTurn : () => { }}>End Turn</button>
          </div>
          <div className='deckplayer1'>
            <HiddenCards deck={this.state.heroesChosen} />
          </div>
        </div>

      </div>
    );
  }
}

export default DeckBoard;
