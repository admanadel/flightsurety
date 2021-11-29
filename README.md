# FlightSurety

FlightSurety is a sample application project for Udacity's Blockchain course.

## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.

To install, download or clone the repo, then:

`npm install`
`truffle compile`

## Dependencies versions
Truffle v4.1.14
Solidity ^0.4.24
NPM 6.14.13
Node v14.17.1

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`
![Dapp tests](img/testdapp.JPG)

`truffle test ./test/oracles.js`
![Dapp tests](img/oracles.JPG)
To use the dapp:

`truffle migrate`
`npm run dapp`

To view dapp:

`http://localhost:8000`
![Dapp tests](img/dappui.JPG)

## Develop Server
`npm run server`
![Run server](img/server.JPG)

## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder


## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)