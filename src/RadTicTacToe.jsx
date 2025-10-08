import React, { useMemo, useState, useEffect } from "react";

/**
 * Rapid Application Development – Simple Game: Tic Tac Toe (2 players)
 *
 * - 2 players with alternating turns
 * - Detects win and draw states
 * - Start a new round without restarting the app
 * - Clear UI with visible state and simple interactions
 * - Readable, commented code
 * - "Custom control": <Board/> and <Square/>
 * - Data entry: player names
 *
 * JavaScript (.jsx) version to match the Vite "react" template you created.
 */

// Winning combinations for a 3x3 board (indices 0..8)
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every((sq) => sq !== null);
}

/**
 * Square: reusable button control for each cell on the board.
 */
function Square({ value, onClick, highlighted }) {
  return (
    <button
      onClick={onClick}
      aria-label={value ? `Square with ${value}` : "Empty square"}
      className={`h-20 w-20 md:h-24 md:w-24 text-3xl md:text-4xl font-semibold rounded-xl border transition
        ${highlighted ? "bg-emerald-100 border-emerald-400" : "bg-white/90 border-gray-300 hover:border-gray-400"}
        focus:outline-none focus:ring-2 focus:ring-indigo-400`}
    >
      {value}
    </button>
  );
}

/**
 * Board: 3x3 grid encapsulating the layout and interaction of the game.
 */
function Board({ squares, onSelect, winLine }) {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {squares.map((value, idx) => (
        <Square key={idx} value={value} onClick={() => onSelect(idx)} highlighted={winLine?.includes(idx)} />
      ))}
    </div>
  );
}

export default function RadTicTacToe() {
  // --- UI state ---
  const [playerX, setPlayerX] = useState("Player X");
  const [playerO, setPlayerO] = useState("Player O");
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [round, setRound] = useState(1);

  // Derived state: winner/draw
  const result = useMemo(() => calculateWinner(board), [board]);
  const isDraw = useMemo(() => !result && isBoardFull(board), [board, result]);

  // Highlight winning line
  const winLine = result?.line ?? null;

  function currentPlayerLabel() {
    return xIsNext ? `${playerX} (X)` : `${playerO} (O)`;
  }

  function handleSelect(index) {
    // Ignore clicks if game is over or square is already filled
    if (result || isDraw || board[index] !== null) return;

    const next = board.slice();
    next[index] = xIsNext ? "X" : "O";
    setBoard(next);
    setXIsNext(!xIsNext);
  }

  // Update scoreboard once when the round finishes (safe with StrictMode)
  const gameOver = !!result || isDraw;
  const [scoredRound, setScoredRound] = useState(null);
  useEffect(() => {
    if (gameOver && scoredRound !== round) {
      setScoredRound(round);
      if (result) {
        setScores((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
      } else if (isDraw) {
        setScores((s) => ({ ...s, draws: s.draws + 1 }));
      }
    }
  }, [gameOver, result, isDraw, round, scoredRound]);

  function newRound() {
    setBoard(Array(9).fill(null));
    setXIsNext(round % 2 === 0); // alternate starting player each round
    setRound((r) => r + 1);
    setScoredRound(null);
  }

  function resetAll() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setScores({ X: 0, O: 0, draws: 0 });
    setRound(1);
    setScoredRound(null);
  }

  // Status message
  let status = "";
  if (result) {
    status = result.winner === "X" ? `${playerX} (X) wins!` : `${playerO} (O) wins!`;
  } else if (isDraw) {
    status = "It's a draw.";
  } else {
    status = `Turn: ${currentPlayerLabel()}`;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-slate-200 p-4 md:p-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tic Tac Toe</h1>
            <p className="text-slate-600">Two players • Restart as many times as you want • Automatic scoreboard</p>
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Round {round}</span>
          </div>
        </header>

        {/* Player setup (data entry for the custom control) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <label className="flex items-center gap-2">
            <span className="w-28 text-sm text-slate-600">Name X:</span>
            <input
              value={playerX}
              onChange={(e) => setPlayerX(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Player X"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="w-28 text-sm text-slate-600">Name O:</span>
            <input
              value={playerO}
              onChange={(e) => setPlayerO(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Player O"
            />
          </label>
        </section>

        {/* Game area */}
        <section className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="flex-1 flex flex-col items-center gap-4">
            <Board squares={board} onSelect={handleSelect} winLine={winLine} />
            <p
              className={`text-base md:text-lg font-medium ${
                result ? "text-emerald-700" : isDraw ? "text-amber-700" : "text-slate-700"
              }`}
            >
              {status}
            </p>
            <div className="flex gap-3">
              <button
                onClick={newRound}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                New Round
              </button>
              <button
                onClick={resetAll}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-medium border border-slate-300 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Full Reset
              </button>
            </div>
          </div>

          {/* Sidebar: scoreboard and tips */}
          <aside className="w-full md:w-56">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="font-semibold mb-3">Scoreboard</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-slate-600">{playerX} (X)</span>
                  <strong className="text-slate-900">{scores.X}</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-600">{playerO} (O)</span>
                  <strong className="text-slate-900">{scores.O}</strong>
                </li>
                <li className="flex items-center justify-between border-t pt-2">
                  <span className="text-slate-600">Draws</span>
                  <strong className="text-slate-900">{scores.draws}</strong>
                </li>
              </ul>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <h3 className="font-semibold text-slate-800 mb-2">How to play</h3>
              <ol className="list-decimal ml-5 space-y-1">
                <li>Players alternate clicking the squares.</li>
                <li>3 in a row wins (horizontal, vertical, or diagonal).</li>
                <li>Use "New Round" to restart without losing the scoreboard.</li>
              </ol>
            </div>
          </aside>
        </section>

        <footer className="mt-6 text-xs text-slate-500">
          <p>Tip: the starting player alternates each round to keep things fair.</p>
        </footer>
      </div>
    </div>
  );
}
