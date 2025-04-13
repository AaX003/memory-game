import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Game.css";


const stack = [
    "🦊", "🐶", "🐱", "🦄", "🌸", "☂️",
    "🍇", "🥞", "🧋", "🩰", "🪅", "🎠"
  ];

function Game() {

  // STATE
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);

  // INITIATE SHUFFLED CARDS
  useEffect(() => {
    const selected = stack.slice(0, 6); // pick 6 pairs (12 total cards)
    const paired = [...selected, ...selected];
    const shuffled = paired
      .map((emoji) => ({
        id: Math.random(),
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  // TIMER LOGIC
  useEffect(() => {
    if (time <= 0 || isPaused || showWinDialog) return;

    const timerInterval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          setShowGameOverDialog(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [time, isPaused, showWinDialog]);

  // MATCH CHECKER
  useEffect(() => {
    if (firstCard && secondCard) {
      if (firstCard.emoji === secondCard.emoji) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.emoji === firstCard.emoji
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedCount((prev) => prev + 1);
        setScore((prev) => prev + 1);
        resetFlips();

      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          resetFlips();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  useEffect(() => {
    if (matchedCount === 6) {
        setShowWinDialog(true);
        setIsPaused(true);
        setShowGameOverDialog(false);
    }
  }, [matchedCount]);  

  const resetFlips = () => {
    setFirstCard(null);
    setSecondCard(null);
  };

  const handleCardClick = (card) => {
    if (card.isFlipped || card.isMatched || secondCard) return;

    const updatedCard = { ...card, isFlipped: true };
    const updatedCards = cards.map((c) =>
      c.id === card.id ? updatedCard : c
    );
    setCards(updatedCards);

    if (!firstCard) {
      setFirstCard(updatedCard);
    } else {
      setSecondCard(updatedCard);
    }
  };

  // RESET GAME
  const resetGame = () => {
    setScore(0);
    setTime(60);
    setMatchedCount(0);
    setShowGameOverDialog(false);
    setShowWinDialog(false);
    setIsPaused(false);
    setFirstCard(null);
    setSecondCard(null);

    const selected = stack.slice(0, 6);
    const paired = [...selected, ...selected];
    const shuffled = paired
      .map((emoji) => ({
        id: Math.random(),
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  return (
    <div className="game-container">
      <div className="game-stats">
        <h1>Score: {score}</h1>
        <h1>Time: {time}</h1>
      </div>

      {/* GAME BOARD */}
      <div className="game-board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped || card.isMatched ? "flipped" : ""}`}
            onClick={() => handleCardClick(card)}
          >
            <div
            key={card.id}
            className={`card ${card.isFlipped || card.isMatched ? "flipped" : ""}`}
            onClick={() => handleCardClick(card)}
        >
        <div className="card-inner">
            <div className="card-front">{card.emoji}</div>
            <div className="card-back">❓</div>
        </div>
        </div>

          </div>
        ))}
      </div>

      {(showWinDialog || showGameOverDialog || isPaused) && (
        <div className="dialog-backdrop"></div>
        )}

      {/* WIN MESSAGE */}
      {showWinDialog && !showGameOverDialog && (
        <div className="win-dialog">
            <p className="win-msg">YOU WIN!</p>
            <button className="reset-btn" onClick={resetGame}>Reset Game</button>
            <Link to="/" className="back-btn">Back</Link>
        </div>
      )}

      {/* GAME OVER MESSAGE */}
      {showGameOverDialog && !showWinDialog && !isPaused && (
        <div className="game-over-dialog">
            <div className="game-over-msg">Game Over! You scored: {score}</div>
            <button className="play-again-btn" onClick={resetGame}>Play Again?</button>
        </div>
      )}

      {/* PAUSE MENU */}
    {isPaused && !showGameOverDialog && !showWinDialog && (
    <div className="pause-dialog">
        <p className="pause-msg">Game Paused</p>
        <button className="resume-btn" onClick={() => setIsPaused(false)}>
        Resume
        </button>
        <Link to="/" className="exit-btn">Exit</Link>
    </div>
    )}

      {/* RESET + BACK */}
      <button
        className="reset-btn"
        style={{
            visibility: showWinDialog || showGameOverDialog || isPaused ? "hidden" : "visible"
        }}
        onClick={resetGame}
        >
        Reset
        </button>

        <Link
        to="/"
        className="back-btn"
        style={{
            visibility: showWinDialog || showGameOverDialog || isPaused ? "hidden" : "visible"
        }}
        >
        Back
        </Link>
    </div>
  );
}

export default Game;
