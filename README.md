
<h1 align="center">RPS Game</h1>

<h3 align="center"> Web3 dApp to play Rock, Paper, Scissors, Spock, Lizard</h3>

<!-- TABLE OF CONTENTS -->
<details open>
  <summary>Table of Contents</summary>
  <ul>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#game-rules">Game Rules</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#how-to-use-in-dev">How to use in dev?</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ul>
</details>

## About The Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Built with Web3js and openzeppelin-contracts. Simple dApp 
to play Rock, Paper, Scissors, Spock, and Lizard with this smart contract: [RPS.sol](https://github.com/clesaege/RPS/blob/master/RPS.sol)

##  Game Rules 

A Simple Way to Remember Who Wins:

> Scissors cuts paper.\
> Paper covers rock.\
> Rock crushes lizard.\
> Lizard poisons Spock.\
> Spock smashes scissors.\
> Scissors decapitates lizard.\
> Lizard eats paper.\
> Paper disproves Spock.\
> Spock vaporizes rock.\
> Rock crushes scissors.

<p><a href="https://commons.wikimedia.org/wiki/File:Rock_Paper_Scissors_Lizard_Spock_en.svg#/media/File:Rock_Paper_Scissors_Lizard_Spock_en.svg"><img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Rock_Paper_Scissors_Lizard_Spock_en.svg" alt="Rock Paper Scissors Lizard Spock en.svg" height="365" width="400"></a>

## Tech Stack

[![](https://img.shields.io/badge/Built_with-React-blue?style=for-the-badge&logo=React)](https://react.dev/)
[![](https://img.shields.io/badge/Built_with-Javascript-yellow?style=for-the-badge&logo=Javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Prerequisites

Make sure to have Ganache, Truffle, and NPM installed.

## How To Use In Dev?

1. Get Ganache running locally. Add local Ganache network to Metamask and connect it to the local Ganache instance. Import atleast 2 accounts to metamask.
2. Navigate to `web3-game/`:
   ``` 
   cd /path/to/folder/web3-game/
   ```
3. Fill in the `.env.sample` file, and then rename the file to `.env.development`. Here are some details about the fields in the config file:
    1. `REACT_APP_TIMEOUT`: Duration before which the other player can recover ETH in case non-activity. Default is 5 minute. (Default=300000)
    2. `REACT_APP_POLL_FREQUENCY`: Polling frequency to check if the other player has reacted. (Default=5000)
4. Get dependencies:
   ``` 
   npm install
   ```
5. Run the app:
   ``` 
   npm start
   ```

## Contributing

Feel free to fork this repository, make changes, and submit pull requests. Any kind of contributions are welcome!

## License

[MIT](https://github.com/ausaf007/web3-game/blob/master/LICENSE)



