
import React, { Component } from 'react';
import './ConnectFour.css';

const dims = {rows: 6, cols:7};

var socket = require('socket.io-client')('http://localhost:5000');

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
    constructor() {
        super();
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

    render() {
        return (
            <div className="App">
                <Game/>
            </div>
        );
    }
}

export default Connect4;

