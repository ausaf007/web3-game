
<h1 align="center">RPS Game</h1>

<h3 align="center"> Web3 Application to play Rock, Paper, Scissors, Spock, Lizard</h3>

<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Table of Contents</summary>
  <ul>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#how-to-use-in-dev">How to use in dev?</a></li>
    <li><a href="#mixed-strategy-nash-equilibria">Mixed Strategy Nash Equilibria</a></li>
    <li><a href="#improvements">Improvements</a></li>
  </ul>
</details>

## About The Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Simple dApp 
to play RPS with Ethereum Smart Contract. 

## Tech Stack

[![](https://img.shields.io/badge/Built_with-React-blue?style=for-the-badge&logo=React)](https://react.dev/)
[![](https://img.shields.io/badge/Built_with-Javascript-yellow?style=for-the-badge&logo=Javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Prerequisites

Make sure to have Ganache, Truffle, and NPM installed.

## How To Use In Dev?

1. Get Ganache running locally. Add local Ganache network to Metamask and connect it to the local Ganache instance. Import atleast 2 accounts to metamask.
2. Using Truffle, deploy Hasher smart contract locally and note the contract address.
3. Navigate to `web3-game/`:
   ``` 
   cd /path/to/folder/web3-game/
   ```
4. Open `.env.sample` file and fill in the `REACT_APP_HASHER_CONTRACT_ADDRESS` field with the deployed contract address. 
   Other fields can be left as default. Then rename the file to `.env.development`. Here are some details about the fields in the config file:
    1. `REACT_APP_TIMEOUT`: Duration before which the other player can recover ETH in case non-activity. Default is 5 minute. (Default=300000)
    2. `REACT_APP_POLL_FREQUENCY`: Polling frequency to check if the other player has reacted. (Default=5000)
5. Get dependencies:
   ``` 
   npm install
   ```
6. Run the app:
   ``` 
   npm start
   ```
   
## Mixed Strategy Nash Equilibria

- What is the Mixed strategy Nash equilibria of this game?
- Given the symmetry in this game, the answer is **1/5 probability**. That is, if you randomly select each of the 
weapons(rock, paper, scissors, spock, lizard) with 1/5 probability to each weapon, you have the highest chance 
of winning. This is the most optimal approach. 

## Improvements

- Add testing
- Add end-to-end type-safety
- Create a Recover ETH page which allows user-1 to enter his move and salt manually, and then reveal his Move 
(In case the user accidentally clears the local storage from the web page).
- Create a Recover ETH page for both player-1 and player-2 to call j2Timeout and j1Timeout functions manually.
- Make error messages more specific
- Remove code duplication between `RecoverGame` and `StartGame`, especially in the reveal function
- Add multi-level logging

Thank you!


