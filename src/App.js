import { useState } from "react";
import "./styles.css";

const Square = ({ content, onClick }) => (
  <button className="square" onClick={onClick}>
    {content}
  </button>
);

function Board({ currentPlayer, boardState, handleTurn, moves, pieceTotals, highlightedSquare, setHighlightedSquare }) {
  function selectSquare(index) {
    if (determineWinner(boardState)) return;
    const player = currentPlayer === true ? "X" : "O";
    const occupiedCenter = boardState[4] === player;
    const playerPieceCount = pieceTotals[player];

    
    
    if (playerPieceCount < 3) {
      if (!boardState[index]) {
        const updatedBoard = boardState.slice();
        updatedBoard[index] = player;
        handleTurn(updatedBoard, player, playerPieceCount + 1);
      }
      return;
    }

    if (boardState[index] === player) {
      if (index === highlightedSquare) {
        setHighlightedSquare(null);
      } else {
        setHighlightedSquare(index);
      }
    } else if (highlightedSquare !== null && !boardState[index] && moves[highlightedSquare].includes(index)) {
      const updatedBoard = boardState.slice();
      updatedBoard[index] = player;
      updatedBoard[highlightedSquare] = null;

      if (occupiedCenter) {
        if (highlightedSquare !== 4 && determineWinner(updatedBoard) === null) {
          return;
        }
      }

      handleTurn(updatedBoard, player, playerPieceCount);
      setHighlightedSquare(null);
    }
  }

  const winner = determineWinner(boardState);
  const gameStatus = winner ? `Winner: ${winner}` : `Next player: ${currentPlayer ? "X" : "O"}`;

  return (
    <>
      <div className="status">{gameStatus}</div>
      {[0, 3, 6].map((rowStart) => (
        <div key={rowStart} className="board-row">
          {Array.from({ length: 3 }).map((_, i) => (
            <Square
              key={rowStart + i}
              content={boardState[rowStart + i]}
              onClick={() => selectSquare(rowStart + i)}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [moves] = useState({
    0: [1, 3, 4],
    1: [0, 2, 3, 4, 5],
    2: [1, 4, 5],
    3: [0, 1, 4, 6, 7],
    4: [0, 1, 2, 3, 5, 6, 7, 8],
    5: [1, 2, 4, 7, 8],
    6: [3, 4, 7],
    7: [3, 4, 5, 6, 8],
    8: [4, 5, 7],
  });
  const [currentTurn, setCurrentTurn] = useState(0);
  const [highlightedSquare, setHighlightedSquare] = useState(null);
  const currentPlayer = currentTurn % 2 === 0;
  const boardState = history[currentTurn];

  const [pieceTotals, updatePieceTotals] = useState({ X: 0, O: 0 });

  function handleTurn(updatedBoard, player, newCount) {
    const nextHistory = [...history.slice(0, currentTurn + 1), updatedBoard];
    setHistory(nextHistory);
    setCurrentTurn(nextHistory.length - 1);
    updatePieceTotals((prev) => {
      return { ...prev, [player]: newCount };
    });
  }

  function jumpToTurn(turn) {
    setCurrentTurn(turn);
    updatePieceTotals({ X: 0, O: 0 });
    setHighlightedSquare(null);
  }

  const moveHistory = history.map((_, turn) => (
    <li key={turn}>
      <button onClick={() => jumpToTurn(turn)}>
        {turn > 0 ? `Go to move #${turn}` : "Go to game start"}
      </button>
    </li>
  ));

  return (
    <div className="game">
      <div className="game-board">
        <Board
          currentPlayer={currentPlayer}
          boardState={boardState}
          handleTurn={handleTurn}
          moves={moves}
          pieceTotals={pieceTotals}
          highlightedSquare={highlightedSquare}
          setHighlightedSquare={setHighlightedSquare}
        />
      </div>
      <div className="game-info">
        <ol>{moveHistory}</ol>
      </div>
    </div>
  );
}

function determineWinner(boardState) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of winPatterns) {
    const [a, b, c] = line;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }  
  return null;
}
