import React from 'react';
import { Link } from 'react-router-dom';

function RPSGame() {
    return (
        <div>
            <h1>RPS Game</h1>
            <Link to="/start"><button>Start New Game</button></Link>
            <Link to="/join"><button>Join Existing Game</button></Link>
            <br />
            <Link to="/recover"><button>Recover Game</button></Link>
        </div>
    );
}

export default RPSGame;

