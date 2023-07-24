import React from 'react';

const moves = [
    'Rock',
    'Paper',
    'Scissors',
    'Spock',
    'Lizard'
];

function MoveSelector({ disabled, selectedMove, onMoveChange }) {
    return (
        <label>
            Your move:
            <select disabled={disabled} value={selectedMove} onChange={e => onMoveChange(e.target.value)}>
                {moves.map(move => (
                    <option key={move} value={move}>{move}</option>
                ))}
            </select>
        </label>
    );
}

export default MoveSelector;
