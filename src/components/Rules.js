import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../css/Rules.css";

function Rules() {
    const [showCurrentCard, setShowCurrentCard] = useState(0);

    const rules = [
        "Match the cards with their pairing!",
        "Every match adds points to your score!",
        "You're timed! Make sure you get all your matches before time's up!",
        "Have fun!"
    ];

    const handleNext = () => {
        if (showCurrentCard < rules.length - 1) {
            setShowCurrentCard(showCurrentCard + 1);
        }
    };

    return (
        <div className="rules-container">
        
            <div className="rules-card-list">
                <p className="rules-card">{rules[showCurrentCard]}</p>
            </div>
            
            {showCurrentCard < rules.length - 1 ? (
                <button className="next-btn" onClick={handleNext}>Next</button>
            ) : (
                <Link to="/game" className="next-btn">Let’s Play!</Link>
            )}

            <Link to="/" className="return-btn">Return</Link>
        </div>
    );
};
export default Rules;