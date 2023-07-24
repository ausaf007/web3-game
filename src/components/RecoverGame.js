import React, {useState} from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import swal from "sweetalert";
import Web3 from "web3";
import {getGameState, moveMapping, resetGameState, showAlertAndReload, win} from "../utils/gameUtils";
import RPSContract from "../contracts/RPS.json";

function RecoverGame() {
    const [saltBN, setSaltBN] = useState(null);
    const revealMove = async () => {

        // Ensure MetaMask is connected
        const provider = await detectEthereumProvider();
        if (!provider) {
            swal("Error!", "Please install MetaMask to use this dapp!", "error");
            return;
        }

        // Fetch data from local storage
        const gameState = getGameState();
        if (gameState === null){
            swal("Error!", "Cannot reveal move. Game not initialized or salt missing.", "error");
            return;
        }

        try {
            const {contractAddress, move, salt} = gameState;
            setSaltBN(salt);
            await provider.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const moveInt = moveMapping[move];

            const rpsGame = new web3.eth.Contract(RPSContract.abi, contractAddress);
            await rpsGame.methods.solve(moveInt, saltBN).send({ from: accounts[0] });

            // Get player-2's move
            const moveOfPlayer2 = await rpsGame.methods.c2().call();

            if (Number(moveOfPlayer2) === moveMapping[move]) {
                await showAlertAndReload("Tie","It's a tie!", "info").then(resetGameState);
            } else if (win(moveMapping[move], Number(moveOfPlayer2))) {
                await showAlertAndReload("Congratulations!", "You win!", "success").then(resetGameState);
            } else {
                await showAlertAndReload("Oops...", "You lost.", "info").then(resetGameState);
            }
        } catch (error) {
            swal("Error!", "An error occurred while revealing the move: "+error.message + "\n\nPerhaps player-2 still has not played", "error");
        }
    };
    return (
        <div>
            <h1>Recovery using Saved Game state</h1>
            <br />
            <button onClick={revealMove}>Recover ETH</button>
        </div>
    );
}

export default RecoverGame;
