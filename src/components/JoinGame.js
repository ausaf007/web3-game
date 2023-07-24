import React, {useEffect, useState} from 'react';
import Web3 from 'web3';
import RPSContract from '../contracts/RPS.json';
import detectEthereumProvider from '@metamask/detect-provider';
import {moveMapping, showAlertAndReload} from '../utils/gameUtils';
import MoveSelector from "./MoveSelector";
import swal from 'sweetalert';

const timeout = Number(process.env.REACT_APP_TIMEOUT);
const pollFrequency = Number(process.env.REACT_APP_POLL_FREQUENCY);

function JoinGame() {
    const [contractAddress, setContractAddress] = useState('');
    const [move, setMove] = useState('Rock');

    const [contractInstance, setContractInstance] = useState(null);
    const [recoverAvailable, setRecoverAvailable] = useState(false);

    // Polling logic to check if player 1 has revealed his move
    // If player-1 reveals his move in time, then Game Ends,
    // If he doesn't player-2 gets a chance to recover his funds
    useEffect(() => {
        if (contractInstance) {
            const end = Date.now() + timeout;
            const interval = setInterval(async () => {
                const currentStake = await contractInstance.methods.stake().call();
                const c2Move = await contractInstance.methods.c2().call();

                // Condition that the time is out and player-1 has not revealed his move
                if (Date.now() > end && Number(c2Move) !== 0 && Number(currentStake) > 0) {
                    setRecoverAvailable(true);
                    clearInterval(interval);
                }
                // If currentStake is 0, then it means player-1 played his move
                if (Number(currentStake) === 0) {
                    clearInterval(interval);
                    showAlertAndReload("Game Over!", "Player-1 revealed his move! Game Over", "info")
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
            const rpsGame = new web3.eth.Contract(RPSContract.abi, contractAddress);
            await rpsGame.methods.j1Timeout().send({ from: accounts[0] });
            showAlertAndReload("Success!", "Funds successfully recovered!", "success")
        } catch (error) {
            swal("Error!", "An error occurred while recovering the funds: " + error.message, "error");
        }
    };

    const joinAndPlay = async () => {
        const provider = await detectEthereumProvider();
        if (!provider) {
            swal("Error!", "Please install MetaMask to use this dapp!", "error");
            return;
        }
        if (!(contractAddress && move)){
            swal("Error!", "Cannot start game. Please fill all the fields.", "error");
            return;
        }

        try {
            await provider.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();

            const moveInt = moveMapping[move];

            const rpsGame = new web3.eth.Contract(RPSContract.abi, contractAddress);

            const stake = await rpsGame.methods.stake().call();
            await rpsGame.methods.play(moveInt).send({ from: accounts[0], value: stake });
            swal("Move submitted! Waiting for the reveal.");

            setContractInstance(rpsGame);
        } catch (error) {
            swal("Error!", "An error occurred while joining the game: "+error.message, "error");
        }
    };

    return (
        <div>
            <h2>Join and play a game</h2>
            <label>
                Contract Address:
                <input type="text" value={contractAddress} onChange={e => setContractAddress(e.target.value)} />
            </label>
            <br />
            <MoveSelector selectedMove={move} onMoveChange={setMove} />
            <br />
            <button onClick={joinAndPlay}>Join and Play</button>
            <br />
            <button disabled={!recoverAvailable} onClick={recoverFunds}>Recover ETH</button>
        </div>
    );
}

export default JoinGame;
