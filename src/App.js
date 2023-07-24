import React from 'react';
import './App.css';
import RPSGame from './components/RPSGame';
import StartGame from './components/StartGame';
import JoinGame from './components/JoinGame';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecoverGame from "./components/RecoverGame";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<RPSGame />} />
                    <Route path="/start" element={<StartGame />} />
                    <Route path="/join" element={<JoinGame />} />
                    <Route path="/recover" element={<RecoverGame />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
