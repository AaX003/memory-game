import React from "react";
import { Link } from "react-router-dom";

import "../css/Menu.css";

function Menu() {
    return (
        <div className="menu-container">
          <h1 className="title">Memory Game</h1>
            <Link to="/game" className="play-btn">Play</Link><br></br>
            <Link to="/rules" className="rules-btn">Rules</Link>
            
        </div>
    );
};
export default Menu;