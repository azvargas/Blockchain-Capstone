pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

import "./Verifier.sol";
import "./ERC721Mintable.sol";


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RealEstateMarket {
    using Pairing for *;

    // TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
    Verifier verifierContract = new Verifier();

    uint256 solCount;

    struct Solution {
        Verifier.Proof   proof;
        uint[2]          input;
    }

    // TODO define a solutions struct that can hold an index & an address
    struct UserSolution {
        Solution solution;
        uint     index;
        address  owner;
    }

    // TODO define an array of the above struct
    UserSolution[] solutionsStorage;

    // TODO define a mapping to store unique solutions submitted
    mapping(uint => bool) private usedSolns;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded();

    constructor() public
    {
        solCount = 0;
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(Verifier.Proof memory proof, uint[2] memory input) public
    {
        solCount++;
        UserSolution memory newSolution = UserSolution(Solution(proof, input), solCount, msg.sender);
        solutionsStorage.push(newSolution);
        emit SolutionAdded();
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(address to, uint256 tokenId) public
    {
        bool foundValid = false;

        for(uint i = 0; i < solutionsStorage.length; i++) {
            if(solutionsStorage[i].owner == to) {
                if(!usedSolns[solutionsStorage[i].index]) {
                    if(verifierContract.verifyTx(solutionsStorage[i].solution.proof, solutionsStorage[i].solution.input)) {
                        usedSolns[solutionsStorage[i].index] = true;
                        foundValid = true;
                        break;
                    }
                }
            }
        }
        require(foundValid, "The address has no send a valid solution");
        super.mint(to, tokenId);
    }
}

  


























