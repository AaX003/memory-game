import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/Game.css";

const stack = [
    "🍇", "🥞", "🧋", "🩰", "🪅", "🎠"
  ];

function Game() {

  // STATE
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);

  // Prevents card flipping during paused, win or lose states
  const isBoardLocked =
  isPaused || showPauseDialog || showGameOverDialog || showWinDialog;

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
    if (isBoardLocked || card.isMatched || card.isFlipped) return;

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


  // PAUSE GAME
  const pauseGame = () => {
    setIsPaused(true);
    setShowPauseDialog(true);
  }

  const navigate = useNavigate();

  const returnHome = () => {
    navigate("/");
  }

  
  return (
    <div className="game-container">

      <h3 className="title">Memory Game</h3>
      <p className="subtitle">Find all the matching pairs to win</p>

      <div className="game-stats">
        <h3>Score: {score}</h3>
        <h3>Time: {time}</h3>
      </div>

      {/* GAME BOARD */}
      <div className="game-board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped || card.isMatched ? "flipped" : ""}`}
            onClick={() => handleCardClick(card)}
          >
          <div className="card-inner">
          <div className="card-front">{card.emoji}</div>
          <div className="card-back">?</div>
        </div>
        </div>
        ))}
      </div>

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
            <p className="game-over-msg">Game Over! Score: {score}</p>
            <button className="play-again-btn" onClick={resetGame}>Play Again?</button>
        </div>
      )}

      {/* PAUSE MENU */}
    {isPaused &&  showPauseDialog && !showGameOverDialog && !showWinDialog && (
    <div className="pause-dialog">
        <p className="pause-msg">Game Paused</p>
        <button className="resume-btn" onClick={() => {setIsPaused(false);  setShowPauseDialog(false);}}>
        Resume
        </button>
        <Link to="/" className="exit-btn">Exit</Link>
    </div>
    )}

     
      <div className="nav">
        <button className="reset-btn" onClick={resetGame} disabled={isBoardLocked}>
        Reset
       </button>
       <button className="pause-btn" onClick={pauseGame} disabled={isBoardLocked}>
        Pause
       </button>
       <button className="back-btn" onClick={returnHome} disabled={isBoardLocked}>
         Back
       </button>
      </div>
       
     
     
    </div>
  );
}

export default Game;
