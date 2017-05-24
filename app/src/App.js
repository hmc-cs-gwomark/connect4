import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const dims = {rows: 6, cols:7}

function winInArray(array, correct) {
    for (var i = 0; i < array.length - 3; i++) {
        console.log(correct);
        console.log(array.slice(i, i+4) == correct);
        if (correct === array.slice(i, i+4)) {
            return true;
        }
    }
    return false;
}

function winInRow(board, correct) {
    for (var row = 0; row < dims.rows; row++) {
        if ( winInArray(board[row], correct) )
            return true
    }
    return false;
}

function winInCol(board, correct) {
    var createArray = function (col) {
        return board.map((row) => row[col]);
    }
    for (var col = 0; col < dims.cols; col++) {
        if ( winInArray(createArray(col), correct) )
        return true;

    }
    return false;
}

function winRightDiag(board, correct){
    var listOfVals
    var i, j;
    for (i = 0; i < dims.rows-3; i++) {
        listOfVals = [];
        for (j = 0; j < dims.cols-i; j++) {
            listOfVals.push(board[i][j]);
        }
        if (winInArray(listOfVals, correct))
            return true;
    }

    for (j = 0; j < dims.cols-3; j++) {
        listOfVals = [];
        for (i = 0; i < dims.rows-j; i++) {
            listOfVals.push(board[i][j]);
        }
        if (winInArray(listOfVals, correct))
            return true;
    }

    return false;
}

function winLeftDiag(board, correct){
    var listOfVals;
    var i,j;
    for (i = 3; i < dims.rows; i++) {
        listOfVals = [];
        for (j = 0; j <= i; j++) {
            listOfVals.push(board[i][j]);
        }
        if (winInArray(listOfVals, correct))
            return true;
    }

    for (j = 0; j < dims.cols-3; j++) {
        listOfVals = [];
        for (i = dims.rows-1; i >= j; i--) {
            listOfVals.push(board[i][j]);
        }
        if (winInArray(listOfVals, correct))
            return true;
    }

    return false;
}

function calculateWinner(board, curPlayer) {
    var correct = Array(4).fill(curPlayer);
    var winFuncs = [winLeftDiag, winRightDiag, winInCol, winInRow];
    return winFuncs.map((func) => func(board, correct)).reduce((x,y) => x || y);
}


class Square extends Component {
    render() {
        var sqStyle = {
            background: this.props.value
        };
        return(
            <button className="square" onClick={this.props.onClick} style={sqStyle}>
            </button>
        );
    }
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
                <div key={i}>
                    {row}
                </div>
            );
        });
        return (
            <div>
                {board}
            </div>)
    }
}

class Game extends Component {
    constructor() {
        super();
        this.state = {
            history: [{
                        board: Array(dims.rows).fill(0).map((row) => Array(dims.cols).fill("white"))
                     }],
            stepNumber: 0,
            redIsNext: true,
            gameOver: false
        }
    }

    handleClick(i, j) {
        //Adjust the history and grab the current state of the board as a copy
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1]
        const newBoard = current.board.slice().map((row) => row.slice());
        if (newBoard[i][j] !== "white") {
            return;
        }

        var curPlayer = this.state.redIsNext ? "red" : "black";

        // Make the move
        newBoard[i][j] = curPlayer;
        var isWin = calculateWinner(newBoard, curPlayer);
        console.log(isWin);
        if (isWin) {
            this.setState({
                gameOver: true
            })
            return;
        }

        // Update the state of the game and rerender
        this.setState({
            history: history.concat([{
                board: newBoard
            }]),
            stepNumber: history.length,
            redIsNext: !this.state.redIsNext,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        return(
            <div className="game">
                <div className="game-board">
                    <Board
                        board={current.board}
                        onClick={(i, j) => this.handleClick(i, j)}
                    />
                </div>
            </div>
        );
    }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <Game />
      </div>
    );
  }
}

export default App;
