import swal from 'sweetalert';
const timeout = Number(process.env.REACT_APP_TIMEOUT);
export const moveMapping = {
    'Rock': 1,
    'Paper': 2,
    'Scissors': 3,
    'Spock': 4,
    'Lizard': 5
};

export const showAlertAndReload = async (title, text, icon) => {
    await swal(title, text, icon)
        .then(() => {
            window.location.reload();
        });
};

// To save salt with a 5-minute validity
export const saveGameState = (salt, move, contractAddress) => {
    const expirationTime = Date.now() + (timeout);  // 5 minutes in milliseconds
    localStorage.setItem('salt', salt);
    localStorage.setItem('saltExpiration', expirationTime.toString());
    localStorage.setItem('move', move);
    localStorage.setItem('contractAddress', contractAddress)
};

// To retrieve the salt
export const getGameState = () => {
    const expirationTime = Number(localStorage.getItem('saltExpiration'));
    if (!expirationTime || Date.now() > expirationTime) {
        // Salt is expired or doesn't exist
        // Cleaning local storage
        resetGameState();
        return null;
    }
    return {
        salt: localStorage.getItem('salt'),
        move: localStorage.getItem('move'),
        contractAddress: localStorage.getItem('contractAddress'),
        saltExpiration: localStorage.getItem('saltExpiration')
    };
};

export const resetGameState = () => {
    localStorage.removeItem('salt');
    localStorage.removeItem('saltExpiration');
    localStorage.removeItem('move');
    localStorage.removeItem('contractAddress')
};

// Helper function replicating the win logic from the contract
export function win(c1, c2) {
    if (c1 === c2) return false;
    else if (c1 === 0) return false;
    else if (c1 % 2 === c2 % 2) return c1 < c2;
    else return c1 > c2;
}