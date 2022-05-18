# Udacity Blockchain Capstone

## Testing the code

The development network at truffle-config.js and mint.js files is configured to search for Ganache or Truffle develop at http://127.0.0.1:7545

Truffle tests files are located at .\test folder.

In the .\zokrates\code\square\proofs folder are located 10 solutions used to mint 10 tokens.

Once compiled and deployed the contracts, run the mint.js script located at .\scripts folder using the command  ```node mint.js```. This scripts will upload the solutions and will mint 10 tokens using the mintToken method at SolnSquareVerifier contract. This contract will store the tokens.

## Tests made at Rinkeby

### Contracts addresses

Migrations: 0xA288371E2D6C4D7E92Db34090C66c98cd587d728<br />
RealEstateMarket: 0x99F1Ca07E4E26B6838D1Ae2ab0D66BA918f6a0DB<br />
Verifier: 0xfaaaC29A2c2CC098f9850cAe0Ab91244fa82465A<br />
SolnSquareVerifier (this contract stores the tokens): 0x32b254fF832987f48D2BE69Dda0D0CD4C8974eea<br /> 

OpenSea store front: [https://testnets.opensea.io/collection/title-of-property-v3
](https://testnets.opensea.io/collection/title-of-property-v3)

Contract ABI's are located at the .\eth-contracts\build\contracts folder of the project.



