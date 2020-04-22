import React from 'react';
import HandCards from './HandCards';
import './DeckBoard.css';
import Board from './Board';
import HiddenCards from './HiddenCards';
import heroes from './heroes'

class DeckBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heroesChosen: props.heroesChosen,
      cardsAvalaibleForIA: heroes.map(heroe => {
        return {
          name: heroe.name,
          img: heroe.image.url,
          atk: parseInt(heroe.powerstats.combat, 10),
          hp: parseInt(heroe.powerstats.durability, 10),
          power: parseInt(heroe.powerstats.power, 10),
          position: 'deck'
        };
      }),
    };
  }

  componentDidMount() {
    this.randomizeHeroesChosen(this.state.heroesChosen);
    this.randomizeHeroesChosen(this.state.cardsAvalaibleForIA);
  }

  handleHandToBoard = (heroeName) => {
    const newDeck = this.state.heroesChosen.map(heroe => {
      if (heroe.name === heroeName) {
        return { ...heroe, position: 'board' };
      } else {
        return heroe;
      }
    });
    this.setState({ heroesChosen: newDeck });
  }

  randomizeHeroesChosen = (deck) => {
    const newHeroesChosen = deck;
    const heroesChosenRandomized = [];
    const arrayOfRandomNumbers = [];
    while (arrayOfRandomNumbers.length < newHeroesChosen.length) {
      const randomNumber = Math.floor(Math.random() * newHeroesChosen.length);
      if (arrayOfRandomNumbers.indexOf(randomNumber) === -1) {
        arrayOfRandomNumbers.push(randomNumber);
      }
    }

    for (let i = 0; i < newHeroesChosen.length; i++) {
      heroesChosenRandomized.push(newHeroesChosen[arrayOfRandomNumbers[i]]);
    }

    for (let i = 0; i < heroesChosenRandomized.length; i++) {
      for (let j = 0; j < 3; j++) {
        if (heroesChosenRandomized.indexOf(heroesChosenRandomized[i]) === arrayOfRandomNumbers[j]) {
          heroesChosenRandomized[i].position = 'hand';
        }
      }
    }

    this.setState({ deck: heroesChosenRandomized });
  }

  handleDraw = () => {
    const newHeroesChosen = this.state.heroesChosen;
    const randomNumber = Math.floor(Math.random() * newHeroesChosen.filter(heroe => heroe.position === 'deck').length);
    newHeroesChosen.filter(heroe => heroe.position === 'deck')[randomNumber].position = 'hand';
    this.setState({ heroesChosen: newHeroesChosen });
  }

  render() {
    return (
      <div className='deckboard'>
        <div className='leftBoardContainer'>

        </div>
        <div className='centerBoardContainer'>
          <div className="iahand">
            <HandCards heroesChosen={this.state.cardsAvalaibleForIA} randomizeHeroesChosen={this.randomizeHeroesChosen} />
          </div>
          <div className='boardia'>
            <Board heroesChosen={this.state.cardsAvalaibleForIA} />
          </div>
          <div className='boardPlayer1'>
            <Board heroesChosen={this.state.heroesChosen} />
          </div>
          <div className='player1hand'>
            <HandCards heroesChosen={this.state.heroesChosen} onHandleHandToBoard={this.handleHandToBoard} />
          </div>
        </div>
        <div className='rightBoardContainer'>
          <HiddenCards deck={this.state.heroesChosen} />
        </div>


      </div>
    );
  }
}

export default DeckBoard;
