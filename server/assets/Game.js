import {Component} from 'react';
import {withRouter, Redirect} from 'react-router-dom';
import axios from 'axios'
 
var socket = require('socket.io-client')('http://localhost:5000');

// Component for spinning circle animation
function SpinningCircles(props) {
  //problem
}

// HTML to display while waiting for match
function WaitingForMatch(props) {
  return (
    <div>
      <h1>Waiting for user to join...</h1>
      // Ideally add spinning circles here
      <button onClick={props.onGoBack}> Back to Main Menu </button>
    </div>
  )
}


// Code to run if done searching and match not found
function MatchNotFound(props){
  return (
    <div>
      <h1> Unable to find anyone to join </h1>
      <div>
        <button onClick={props.onTryAgain}> Try Again </button>
        <button onClick={props.onGoBack}> Back To Main Menu </button>
      </div>
    </div>
    )
}



// Code to run if match is found
class FoundMatch extends Component {
  constructor(props) {
    super(props);

    this.state = {startMatch: false,
                  seconds: 5}
  }

  componentDidMount() {
    // set variable so we can clear it when component unmounts
    this.interval = null;

    // Start match in 5 seconds
    setTimeout( function() {
      this.setState({startMatch: true});
    }.bind(this), 5000);


    // Start Countdown
    this.interval = setInterval( function() { 
      this.setState((prevState, props) => ({ seconds: prevState.seconds-1})) 
    }.bind(this), 1000);


  }

  componentWillUnmount(){
    // Clear interval to stop countdown
    clearInterval(this.interval);
  }

  render()  {
    // redirect if we're ready to start match
    if (this.state.startMatch) {
      return <Redirect to="/play"/>
    } else {
      // Otherwise display countdown message
      return <h1> Match starting in {this.state.seconds} seconds... </h1>;
    }
  }
}




class WaitingMenu extends Component {

  constructor(props) {
    super(props);

    // 1 1/2 mins till time out
    this.timeOutSeconds = 65000;

    // Variable to hold timeout object for cancelling
    this.timeout = null;

    // Pass the instance of this class to the function defined below with bind
    this.handleSearchFail = this.handleSearchFail.bind(this);
    this.handleGameStart = this.handleGameStart.bind(this);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onTryAgain     = this.onTryAgain.bind(this);
    this.onGoBack       = this.onGoBack.bind(this);

    this.socket = socket;

    this.state = { waiting: true,
                   foundGame: false,
                   goBack: false,
                   debug: true
                 };

  }

  componentDidMount() {

    // Bind function to found match event
    this.socket.on('search|success', this.handleGameStart);

    // Let the server know we want to find a game
    this.socket.emit('find_game', (data) => {
      console.log(data);
    });

    // Wait to find a match for the specified amount of time
    this.timeout = setTimeout(this.handleSearchFail, this.timeOutSeconds);
  }

  handleSearchFail(data) {
    this.setState({waiting: false});
  }

  //Redirects players to their game when it has finally started
  handleGameStart(data) {
    if (this.timeOut){
      clearTimeout(this.timeout);
    }
    this.setState({waiting: false, foundGame:true});
  }

  handleKeyPress(event) {
    if (event.key == 'r') {
      console.log("poopy poopye")
      this.handleSearchFail(null);
    }

    if (event.key == 'e') {
      this.handleGameStart(null);
    }
  }

  onTryAgain(){
    this.setState({waiting:true, foundGame:false});
  }

  onGoBack(){
    this.setState({goBack:true});
  }

  // rendered to DOM
  render() {

    // Debug html, show only if debug is true
    var debug = false;

    if (this.state.goBack) {
      return <Redirect to="/"/>;
    }

    var componentToReturn = false;
    if (this.state.waiting) {
      componentToReturn =  <WaitingForMatch/>;
    } else if (this.state.foundGame) {
      componentToReturn =  <FoundMatch/>;
    } else {
      componentToReturn = <MatchNotFound onTryAgain={this.onTryAgain} onGoBack={this.onGoBack} />;
    }


    if (this.state.debug) {
      debug = (
        <div>
          <h2>DEBUG: Press e for sucessful search, press r for failed search <input onKeyPress={this.handleKeyPress}/> </h2>
        </div>)
    }

    return (<div className='main'>
              {debug}
              {componentToReturn}
            </div>);
  }
}



/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////                                                               /////
/////                                                               /////
/////                         GAME CODE                             /////
/////                                                               /////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////


import './ConnectFour.css';

const dims = {rows: 6, cols:7};

/* ReactJS code begins here*/
function JoinButton(props) {
    return (<button onClick={props.onClick}>Join Game</button>);
}

function Square(props) {
    var sqStyle = {
        height: "30px",
        width: "30px",
        border: "1px solid black",
        background: props.value,
        margin: "0 5px 5px 0",
        animation: "to-" + props.value + " 1s linear",
        display: "inline-block"
    };
    return (<p className="square" onClick={props.onClick} style={sqStyle}></p>);
}

class Board extends Component {
    renderSquare(i, j) {
        return (<Square
                    value={this.props.board[i][j]}
                    onClick={() => this.props.onClick(i,j)}
                    key={j}
                />);
    }

    render() {
        var board = this.props.board.map((row, i) => {
            row = row.map((_, j) => this.renderSquare(i, j))
            return(
                <div key={i} className="row">
                    {row}
                </div>
            );
        });
        return (
            <div>
                {board}
            </div>);
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = Game.defaultState();
        this.socket = socket;

    }

    static defaultState() {
        return {
                history: [{
                    board: Array(dims.rows).fill(0).map((row) => Array(dims.cols).fill("white"))
                }],
                stepNumber: 0,
                myTurn:false,
                winner:false,
                full:false,
                started:false
              };
    }

    componentDidMount() {
        this.socket.on('init', this._initialize.bind(this));
        this.socket.on('move|received', this._handleMove.bind(this));
        this.socket.on('win|full', this._handleWinFull.bind(this));
        this.socket.on('player1', this._makePlayer.bind(this));
        this.socket.on('player2', this._makePlayer.bind(this))
    }

    _initialize(data) {
        var {myTurn} = this.state;
        myTurn = data.myTurn
        this.setState({myTurn});
    }

    _handleMove(data) {
        var curState = this.state;
        curState.history.push(data.board);
        curState.stepNumber++;
        curState.myTurn = data.turn
        this.setState(curState);
    }

    _handleWinFull(data) {
        if (data.error) {
          return;
        }
        if (data.win) {
          this.setState({winner: true});
        }
        if (data.full) {
          this.setState({full:true});
        }
    }

    _makePlayer(data){
        console.log("the data is:", data.turn);
        if (!this.state.started) {
            console.log("yo the game has started?: ", this.state.started);
            this.setState({myTurn:data.turn, started:true});
        }
    }


    handleClick(i, j) {
        if (!this.state.myTurn || this.state.winner || this.state.full) {
            console.log(this.state.myTurn);
            return;
        } else {
          var move = JSON.stringify({column: j});
          this.socket.emit('move:sent', move, function(err) {
                  if (err)
                    return;// try again
          });
        }
    }


    render() {
      var current = this.state.history[this.state.stepNumber];
        return(
            <div className="game">
                <div className="game-board">
                    <Board
                        board={current.board}
                        onClick={(i, j) => this.handleClick(i, j)}
                    />
                </div>
                <div className="join-game">
                    <JoinButton onClick={() => this.findGame()} />
                </div>
            </div>
        );
    }
}


class Connect4 extends Component {
  constructor(props){
    super(props)
    this.state = {playing: false}
  }

  render() {
    var currentView = false;
    if (this.state.playing) {
      currentView = <Game />
    } else {
      currentView = <WaitingMenu />
    }

    return( 
      <div className="App">
        {currentView}
      </div>)
  }

}






export default withRouter(Connect4);