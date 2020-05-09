import React, { Component } from 'react';

class Timer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 3000000
    };
  }

  componentDidMount () {
    this.myInterval = setInterval(() => {
      const { seconds, minutes } = this.state;

      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(this.myInterval);
          this.props.onFinish();
        }
      }
    }, 1000);
  }

  componentWillUnmount () {
    clearInterval(this.myInterval);
  }

  render () {
    const { minutes, seconds } = this.state;
    return (
      <div>
        <h1>It's your turn</h1>
        <h2>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h2>
      </div>
    );
  }
}

export default Timer;
