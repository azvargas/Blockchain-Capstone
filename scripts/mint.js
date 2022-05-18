/*
This code was copied and adapted from the OpenSea example project:
https://github.com/ProjectOpenSea/opensea-creatures/blob/master/scripts/mint.js
*/
const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const fs = require("fs");
const { exit } = require("process");
const MNEMONIC_RINKEBY = "Here was the Rinkeby mnemonic";
const MNEMONIC_GANACHE = "Here was the Ganache mnemonic";
const NODE_API_KEY = "Here was the node API key";
const isInfura = true;
const isGanache = false;
const FACTORY_CONTRACT_ADDRESS_RINKEBY = "0x0000000000000000000000000000000000000000";
const FACTORY_CONTRACT_ADDRESS_GANACHE = "0x0000000000000000000000000000000000000000";
const NFT_CONTRACT_ADDRESS = null;
const OWNER_ADDRESS_RINKEBY = "0x0000000000000000000000000000000000000000";
const OWNER_ADDRESS_GANACHE = "0x0000000000000000000000000000000000000000";
//const NETWORK = "rinkeby"; //uncomment this line if you want to mint on Rinkeby
const NETWORK = "ganache";
const NUM_CREATURES = 10;
const NUM_LOOTBOXES = 4;
const DEFAULT_OPTION_ID = 0;
const LOOTBOX_OPTION_ID = 2;

/*
if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
  );
  return;
}
*/

const NFT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
    ],
    name: "mintTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

/*
const FACTORY_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_toAddress",
        type: "address",
      },
      {
        name: "_optionId",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
*/

async function main() {
  var proof;
  var proofParameter;

  const network =
    NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";

  const MNEMONIC = NETWORK === "rinkeby" ? MNEMONIC_RINKEBY : MNEMONIC_GANACHE;

  const FACTORY_CONTRACT_ADDRESS = NETWORK === "rinkeby" 
    ? FACTORY_CONTRACT_ADDRESS_RINKEBY 
    : FACTORY_CONTRACT_ADDRESS_GANACHE;

  const OWNER_ADDRESS = NETWORK === "rinkeby" ? OWNER_ADDRESS_RINKEBY : OWNER_ADDRESS_GANACHE;

  let solutions = Array('..\\zokrates\\code\\square\\proofs\\proof1.json',
                        '..\\zokrates\\code\\square\\proofs\\proof2.json',
                        '..\\zokrates\\code\\square\\proofs\\proof3.json',
                        '..\\zokrates\\code\\square\\proofs\\proof4.json',
                        '..\\zokrates\\code\\square\\proofs\\proof5.json',
                        '..\\zokrates\\code\\square\\proofs\\proof6.json',
                        '..\\zokrates\\code\\square\\proofs\\proof7.json',
                        '..\\zokrates\\code\\square\\proofs\\proof8.json',
                        '..\\zokrates\\code\\square\\proofs\\proof9.json',
                        '..\\zokrates\\code\\square\\proofs\\proof10.json');

  const provider = new HDWalletProvider(
    MNEMONIC,
    isGanache ? "HTTP://127.0.0.1:7545" : 
    isInfura
      ? "https://" + network + ".infura.io/v3/" + NODE_API_KEY
      : "https://eth-" + network + ".alchemyapi.io/v2/" + NODE_API_KEY
  );
  const web3Instance = new web3(provider);

  var ABI = JSON.parse(fs.readFileSync('..\\eth-contracts\\build\\contracts\\SolnSquareVerifier.json'));
  var FACTORY_ABI = ABI.abi;
  if (FACTORY_CONTRACT_ADDRESS) {
    const factoryContract = new web3Instance.eth.Contract(
      FACTORY_ABI,
      FACTORY_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );

    // Creatures issued directly to the owner.
    for (var i = 0; i < NUM_CREATURES; i++) {
      console.log(`Processing title ${i}`);
      proof = await JSON.parse(fs.readFileSync(solutions[i]));
      proofParameter = {
          a: proof.proof.a,
          b: proof.proof.b,
          c: proof.proof.c
      };
      
      const resultSoln = await factoryContract.methods
        .addSolution(proofParameter, proof.inputs)
        .send({from: OWNER_ADDRESS});
      console.log("Solution sent. Transaction: " + resultSoln.transactionHash);
      
      const result = await factoryContract.methods
        .mint(OWNER_ADDRESS, i)
        .send({ from: OWNER_ADDRESS });
      console.log("Minted property title. Transaction: " + result.transactionHash);
    }

    // Lootboxes issued directly to the owner.
    /*
    for (var i = 0; i < NUM_LOOTBOXES; i++) {
      const result = await factoryContract.methods
        .mint(LOOTBOX_OPTION_ID, OWNER_ADDRESS)
        .send({ from: OWNER_ADDRESS });
      console.log("Minted lootbox. Transaction: " + result.transactionHash);
    }
    */
  } else if (NFT_CONTRACT_ADDRESS) {
    const nftContract = new web3Instance.eth.Contract(
      NFT_ABI,
      NFT_CONTRACT_ADDRESS,
      { gasLimit: "1000000" }
    );

    // Creatures issued directly to the owner.
    for (var i = 0; i < NUM_CREATURES; i++) {
      const result = await nftContract.methods
        .mintTo(OWNER_ADDRESS)
        .send({ from: OWNER_ADDRESS });
      console.log("Minted creature. Transaction: " + result.transactionHash);
    }
  } else {
    console.error(
      "Add NFT_CONTRACT_ADDRESS or FACTORY_CONTRACT_ADDRESS to the environment variables"
    );
  }
  console.log("Finished!");
  return;
}

main();
