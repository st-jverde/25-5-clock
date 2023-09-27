import React from 'react';

class Clock extends React.Component {
  state = {
    breakLength: 5,
    sessionLength:25,
    timeLeft: 25 * 60,
    isRunning: false,
    isSession: true,
  };
  
  incrementBreak = () => {
    this.setState(prevState => ({
      breakLength: Math.min(prevState.breakLength + 1, 60)
    }));
  };

  decrementBreak = () => {
    this.setState(prevState => ({
      breakLength: Math.max(prevState.breakLength - 1, 1)
   }));
  };
  
  incrementSession = () => {
    this.setState(prevState => ({
      sessionLength: Math.min(prevState.sessionLength + 1, 60),
      timeLeft: !prevState.isRunning && prevState.isSession
        ? Math.min(prevState.sessionLength + 1, 60) * 60
        : prevState.timeLeft
    }));
  };

  decrementSession = () => {
    this.setState(prevState => ({
      sessionLength: Math.max(prevState.sessionLength - 1, 1),
      timeLeft: !prevState.isRunning && prevState.isSession
        ? Math.max(prevState.sessionLength - 1, 1) * 60
        : prevState.timeLeft
    }));
  };
  
  playBeep = () => {
    const beep = document.getElementById('beep');
    beep.play().catch(error => console.error(error)); 
  };
  
  stopBeep = () => {
    const beep = document.getElementById('beep');
    beep.pause();
    beep.currentTime = 0;
  }

  
  toggleTimer = () => {
    if (this.state.isRunning) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.setState(prevState => {
          if (prevState.timeLeft <= 0) {
            this.playBeep();
            return {
              isSession: !prevState.isSession,
               timeLeft: prevState.isSession
                ? prevState.breakLength * 60
                : prevState.sessionLength * 60
            };
          } else {
            return { timeLeft: prevState.timeLeft - 1 };
          }
        });
      }, 1000);
    }
    
    this.setState(prevState => ({ isRunning: !prevState.isRunning}));
  };
  
  reset = () => {
    clearInterval(this.timer);
    this.stopBeep();
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 25 * 60,
      isRunning: false,
      isSession: true
    });
  };
  
  render() {
    const audioSample = "/media/beep.wav";
    const minutes = Math.floor(this.state.timeLeft / 60);
    const seconds = this.state.timeLeft % 60;
    
    return (
      <>
        <h1 className="main-title">25+5 Clock</h1>
        <div id="length-control">
          <div className="controls">
            <div id="break-label">
              <h3>Break Length</h3>
              <button className="btn-level" id="break-decrement" onClick={this.decrementBreak}>
                <i className="fa fa-arrow-down"></i>
              </button>
              <div className="btn-level" id="break-length">{this.state.breakLength}</div>
              <button className="btn-level" id="break-increment" onClick={this.incrementBreak}>
                <i className="fa fa-arrow-up"></i>
              </button>
            </div>
          </div>
          <div className="controls">
            <div id="session-label">
              <h3>Session Length</h3>
              <button className="btn-level" id="session-decrement" onClick={this.decrementSession}>
                <i className="fa fa-arrow-down"></i>
              </button>
              <div className="btn-level" id="session-length">{this.state.sessionLength}</div>
              <button className="btn-level" id="session-increment" onClick={this.incrementSession}>
                <i className="fa fa-arrow-up"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="timer">
          <div className="timer-wrapper">
            <div id="timer-label">{this.state.isSession ? "Session" : "Break"}</div>
            <div id="time-left">{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</div>
            <audio id="beep" src={audioSample} type="audio/wav" />
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" onClick={this.toggleTimer}>
            {this.state.isRunning ? (
              <i className="fa fa-pause fa-2x"></i>
            ) : ( 
              <i className="fa fa-play fa-2x"></i>
            )}   
          </button>
          <button id="reset" onClick={this.reset}>
            <i className="fa fa-refresh fa-2x"></i>
          </button>
        </div>
      </>
    )
  }
};

  export default Clock;