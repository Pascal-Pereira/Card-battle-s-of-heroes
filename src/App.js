import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from './components/Home';
import Options from './components/Options';
import Rules from './components/Rules';
import DeckChoice from './components/DeckChoice';
import axios from 'axios';
import DeckBoard from './components/DeckBoard';
import HomeMusic from './components/audio/musics/binarpilot-underground.mp3';
import CardTransition from './components/audio/effects/Card_Transition_Out.ogg';
// import DefeatJingle from './components/audio/effects/defeat_jingle.ogg';
class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      cards: [],
      deck: [],
      maxPower: 800,
      audioOn: false,
      musicOn: false,
      effectsOn: true
    };
  }

  audioMusic = React.createRef();
  audioEffects = React.createRef();

  handlePlayMusic = () => {
    const audio = this.audioMusic.current;
    audio.volume = 0.4;
    audio.paused ? this.setState({ musicOn: false }) : this.setState({ musicOn: true });
    return audio.paused ? audio.play() : audio.stop();
  }

  handlePlayEffects = () => {
    const audio = this.audioEffects.current;
    if (this.state.effectsOn) {
      audio.play()
    }
  }

  triggerEffects = () => {
    this.setState({ effectsOn : !this.state.effectsOn })
  } 

  componentDidMount () {
    this.getHeroesFromAPI();
  }

  getHeroesFromAPI = () => {
    const url = 'https://heroes-api-wrapper.herokuapp.com/heroes?heroIds=354,310,555,711,527,313,638,307,566,381,514,214,561,165,692,341,298,251,107,383,127,30,352,201,196,522,634,627,530,418,551,708,630,599,538,370,398,228,149,480,106,729,309,207,542,333,208,536,431,225,649,60,226,69,678,487,457,145,345,299,361,350,405,602236,620,216717,213,176,581,687,386,414,322,600,303,280,690,467,416,485,423,572,38,697,732,396,275,389,498,476,703,680,185,157,658,325,574,289,308,195,686,645,631,502,232,332,287,659,655,517,35';
    axios.get(url)
      .then(res => res.data)
      .then(data => {
        const tabHeroes = data.map(heroe => {
          return {
            name: heroe.name,
            img: heroe.image.url,
            atk: parseInt(heroe.powerstats.strength, 10),
            hp: parseInt(heroe.powerstats.durability, 10),
            power: Math.round((parseInt(heroe.powerstats.strength, 10) + parseInt(heroe.powerstats.durability, 10)) / 2),
            position: 'deck',
            deadOnBoard: false,
            selected: false,
            iaDeck: false,
            isFighting: false,
            isAbleToAttack: true // true : la carte est autorisée à attaquer
          };
        });
        this.setState({ cards: tabHeroes });
      });
  }

  addToDeck = (cardName) => {
    let copieDeck = this.state.deck.slice();
    const maxPower = this.state.maxPower;
    const totalPower = this.state.deck.map(card => card.power).reduce((acc, cur) => acc + cur, 0);
    if (copieDeck.filter(heroe => cardName === heroe.name).length === 0) {
      if (totalPower + this.state.cards.filter(heroe => cardName === heroe.name)[0].power <= maxPower) {
        copieDeck.push(this.state.cards.filter(heroe => cardName === heroe.name)[0]);
      } else {
        window.alert('Please, select a less powerful card or start the game');
      }
    } else {
      copieDeck = copieDeck.filter(heroe => !cardName.includes(heroe.name));
    }
    this.setState({ deck: copieDeck });
  }

  removeDeck = () => {
    this.setState({ deck: [] });
  }

  render () {
    return (
      <>
        <div className='portrait'>        
        <h1 className='h1-home'>Cards Battle of Heroes</h1>  
          <img 
            class="phone"
            src="https://karagezwebstudio.com/fr/img/rotate.gif"
            alt="turn phone">
        </img>
        </div>
        <div className='App'>
          <div className='music'>
            <audio ref={this.audioMusic} preload='metadata'>
              <source src={HomeMusic} type='audio/mp3' />
              <p>Votre navigateur ne peut pas lire d'audio</p>
            </audio>
            <audio ref={this.audioEffects} preload='metadata'>
              <source src={CardTransition} type='audio/mp3' />
            </audio>
          </div>
          <Router>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/options'>
                <Options onPlayMusic={this.handlePlayMusic} onPlayEffects={this.handlePlayEffects} audioOn={this.state.audioOn} musicOn={this.state.musicOn} effectsOn={this.state.effectsOn} triggerEffects={this.triggerEffects}/>
              </Route>
              <Route path='/rules' component={Rules} />
              <Route path='/deckchoice'>
                <DeckChoice heroes={this.state.cards} heroesChosen={this.state.deck} addToDeck={this.addToDeck} removeDeck={this.removeDeck} maxPower={this.state.maxPower} />
              </Route>
              <Route path='/deckboard'>
                <DeckBoard lastCard={this.state.lastCard} heroes={this.state.cards} heroesChosen={this.state.deck} removeDeck={this.removeDeck} maxPower={this.state.maxPower} />
              </Route>
            </Switch>
          </Router>
        </div>
      </>
    );
  }
}

export default App;
