import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  if (highlight){
    return (
      <button className="square highlight" onClick={onSquareClick}>
        {value}
      </button>
    );
  }
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  let status;
  let winnerLine = winnerInfo[1];
  if (winnerInfo[0]) {
    status = 'Winner: ' + winnerInfo[0] + " with line: " + winnerLine;
  } else {
    if (winnerInfo[2])
    {
      status = 'No winner. Game draw.';
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
  }

  function row(rowIndex, squares, numberOfColumn, winnerLine){
    let row = [];
    for (let index = 0; index < numberOfColumn; index++) {
      const squareIndex = rowIndex*numberOfColumn + index;
      if (winnerLine.includes(squareIndex))
      {
        row.push(<Square key={squareIndex} value={squares[squareIndex]} highlight={true}
          onSquareClick={() => handleClick(squareIndex)} />);
      }
      else {
        row.push(<Square key={squareIndex} value={squares[squareIndex]} highlight={false}
          onSquareClick={() => handleClick(squareIndex)} />);
      }
    }
    return (
      <div key={rowIndex} className='board-row'>{row}</div>
    )
  }

  let board = [];
  const numberOfRow = 3;
  const numberOfColumn = 3;
  for (let rowIndex = 0; rowIndex < numberOfRow; rowIndex++) {
    board.push(row(rowIndex, squares, numberOfColumn, winnerLine));
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [ascendingSortIsNext, setAscendingSortIsNext] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let row = Math.floor(move/3);
    let column = move % 3;
    if (move > 0) {
      description = `Go to move #${move} at (${row},${column})`;
    } else {
      description = 'Go to game start';
    }
    if (move === currentMove) {
      return (
        <li key={move}>
          <div onClick={() => jumpTo(move)}>{description}</div>
        </li>
      );
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (ascendingSortIsNext) {
    moves.reverse();
  }

  function sortButton(){
    let description;
    if (ascendingSortIsNext) {
      description = 'Sort moves ascending';
    } else {
      description = 'Sort moves descending';
    }
    return (
      <div>
        <button onClick={() => sort(ascendingSortIsNext, history)}>{description}</button>
      </div>
    );
  };

  function sort(ascendingSortIsNext, history){
    if (ascendingSortIsNext) {
      setAscendingSortIsNext(false);
    } else {
      setAscendingSortIsNext(true);
    }
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div className="button-menu">
        {sortButton()}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i], false];
    }
  }
  if (!squares.includes(null))
  {
    return [null, [-1, -1, -1], true];
  }
  return [null, [-1, -1, -1], false];
}
