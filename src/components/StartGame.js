import React, {useEffect, useState} from 'react';
import Web3 from 'web3';
import RPSContract from '../contracts/RPS.json';
import Hasher from '../contracts/Hasher.json';
import {moveMapping, resetGameState, saveGameState, showAlertAndReload, win} from '../utils/gameUtils';
import MoveSelector from './MoveSelector';
import detectEthereumProvider from '@metamask/detect-provider';
import swal from 'sweetalert';

const hasherContractAddress = process.env.REACT_APP_HASHER_CONTRACT_ADDRESS;
const timeout = Number(process.env.REACT_APP_TIMEOUT);
const pollFrequency = Number(process.env.REACT_APP_POLL_FREQUENCY);

function StartGame() {

    const [amount, setAmount] = useState('');
    const [player2Address, setPlayer2Address] = useState('');
    const [move, setMove] = useState('Rock');

    const [salt, setSalt] = useState(null);
    const [contractInstance, setContractInstance] = useState(null);
    const [player2HasPlayed, setPlayer2HasPlayed] = useState(false);
    const [recoverAvailable, setRecoverAvailable] = useState(false);

    // Polling logic to check if player 2 has played
    // If player-2 plays in time, reveal move button is enabled,
    // If he doesn't player-1 has a chance to recover his funds
    useEffect(() => {
        if (contractInstance) {
            const end = Date.now() + timeout;
            const interval = setInterval(async () => {
                const moveOfPlayer2 = await contractInstance.methods.c2().call();
                // Check for equality to Move.Null
                if (Number(moveOfPlayer2) !== 0) {
                    setPlayer2HasPlayed(true);
                    clearInterval(interval); // Clear interval once player 2 has played
                } else if (Date.now() > end) {
                    setRecoverAvailable(true); // 5 minutes passed and player 2 hasn't played
                    clearInterval(interval);
                }
            }, pollFrequency); // Check every 5 seconds
            return () => clearInterval(interval);
        }
    }, [contractInstance]);

    const recoverFunds = async () => {
        const provider = await detectEthereumProvider();
        if (!provider) {
            swal("Error!", "Please install MetaMask to use this dapp!", "error");
            return;
        }
        try {
            await provider.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            // Call the j2Timeout function from the RPS contract instance
            await contractInstance.methods.j2Timeout().send({ from: accounts[0] });
            await showAlertAndReload("Success!", "Funds successfully recovered!", "success").then(resetGameState);
        } catch (error) {
            swal("Error!", "An error occurred while recovering the funds: " + error.message, "error");
        }
    };

    const startGame = async () => {
        // Clearing any old game data
        resetGameState();
        
        const provider = await detectEthereumProvider();
        if (!provider) {
            swal("Error!", "Please install MetaMask to use this dapp!", "error");
            return;
        }
        if (!(amount && player2Address && move)){
            swal("Error!", "Cannot start game. Please fill all the fields.", "error");
            return;
        }

        try {
            await provider.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();

            const moveInt = moveMapping[move];

            // Generate a large random salt number for uint256
            const generatedSalt = generateSalt();
            // Store the generated salt in the component's state
            setSalt(generatedSalt);

            const hasherContract = new web3.eth.Contract(Hasher.abi, hasherContractAddress);
            async function getHash(moveInt, salt) {
                return await hasherContract.methods.hash(moveInt, salt).call();
            }
            const moveHash = await getHash(moveInt, generatedSalt);

            // Deploy a new RPS contract for this game
            const RPSGame = new web3.eth.Contract(RPSContract.abi);
            const rpsGameInstance = await RPSGame.deploy({
                data: RPSContract.bytecode,
                arguments: [moveHash, player2Address]
            })
                .send({ from: accounts[0], value: web3.utils.toWei(amount, 'ether') });

            const message = "Game started! Contract deployed at: " + rpsGameInstance.options.address + ",\n\n" +
                "Salt: " + generatedSalt + "\n" +
                "Move: " + move + "\n" +
                "Warning: Keep your salt and move secret!!";

            await swal(message);
            saveGameState(generatedSalt,move,rpsGameInstance.options.address)

            setContractInstance(rpsGameInstance);
        } catch (error){
            swal("Error!", "An error occurred while starting the game: "+error.message, "error");
        }
    };

    const revealMove = async () => {

        // Ensure MetaMask is connected
        const provider = await detectEthereumProvider();
        if (!provider) {
            swal("Error!", "Please install MetaMask to use this dapp!", "error");
            return;
        }
        if (!(contractInstance && salt)){
            swal("Error!", "Cannot reveal move. Game not initialized or salt missing.", "error");
            return;
        }

        try {
            await provider.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const moveInt = moveMapping[move];

            // Call the solve function from the RPS contract instance
            await contractInstance.methods.solve(moveInt, salt).send({ from: accounts[0] });

            // Get player-2's move
            const moveOfPlayer2 = await contractInstance.methods.c2().call();

            if (Number(moveOfPlayer2) === moveMapping[move]) {
                await showAlertAndReload("Tie","It's a tie!", "info").then(resetGameState);
            } else if (win(moveMapping[move], Number(moveOfPlayer2))) {
                await showAlertAndReload("Congratulations!", "You win!", "success").then(resetGameState);
            } else {
                await showAlertAndReload("Oops...", "You lost.", "info").then(resetGameState);
            }
        } catch (error) {
            swal("Error!", "An error occurred while revealing the move: "+error.message, "error");
        }
    };

    return (
        <div>
            <h2>Start a new game</h2>
            <label>
                Amount to stake (in ETH):
                <input type="text" disabled={contractInstance} value={amount} onChange={e => setAmount(e.target.value)} />
            </label>
            <br />
            <label>
                Address of 2nd player:
                <input type="text" disabled={contractInstance} value={player2Address} onChange={e => setPlayer2Address(e.target.value)} />
            </label>
            <br />
            <MoveSelector disabled={contractInstance} selectedMove={move} onMoveChange={setMove} />
            <br />
            <button disabled={contractInstance} onClick={startGame}>Start Game</button>
            <button disabled={!player2HasPlayed} onClick={revealMove}>Reveal Move</button>
            <br />
            <button disabled={!recoverAvailable} onClick={recoverFunds}>Recover ETH</button>
        </div>
    );
}

// Generate cryptographically secure random number
function generateSalt() {
    const byteCount = 32; // 256 bits
    const randomBytes = new Uint8Array(byteCount);
    window.crypto.getRandomValues(randomBytes);

    // Convert the byte array to a big integer string
    let salt = '';
    for (let i = 0; i < randomBytes.length; i++) {
        salt += ('00' + randomBytes[i].toString(16)).slice(-2);
    }
    /* global BigInt */
    return BigInt(`0x${salt}`).toString();
}



export default StartGame;
