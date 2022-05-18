var Verifier = artifacts.require("SolnSquareVerifier");
var fs = require('fs');

contract('SolnSquareVerifier', accounts => {
    
    beforeEach(async function() {
        this.contract = await Verifier.new();
    });

    it('Test if a new solution can be added for contract - SolnSquareVerifier', async function() {
        // Test if a new solution can be added for contract - SolnSquareVerifier
        let eventEmitted = false;

        // Read solution
        let proof = await JSON.parse(fs.readFileSync(".\\test\\proof.json"));
        let proofParameter = {
            a: proof.proof.a,
            b: proof.proof.b,
            c: proof.proof.c
        };

        // Callback for checking then event
        this.contract.SolutionAdded({}, (err, res) => {
            eventEmitted = true;
        });

        // register solution
        let result = await this.contract.addSolution(proofParameter, proof.inputs);
    
        assert.equal(eventEmitted, true, 'Solution has been added');
    });

    it('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', async function() {
        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        var ownerReturnedByEvent;
        var tokenIdMinted;

        let tokenId = 2664;
        let ownerToken = accounts[1];
        let eventEmitted = false;

        // Subscribe to the event
        this.contract.Transfer({}, (err, res) => {
            ownerReturnedByEvent = res.returnValues.to;
            tokenIdMinted = res.returnValues.tokenId;
            eventEmitted = true;
        });

        // Read solution
        let proof = await JSON.parse(fs.readFileSync(".\\test\\proof.json"));
        let proofParameter = {
            a: proof.proof.a,
            b: proof.proof.b,
            c: proof.proof.c
        };

        // register solution
        await this.contract.addSolution(proofParameter, proof.inputs, {from:ownerToken});

        // Mint token
        await this.contract.mintToken(ownerToken, tokenId);
        assert.equal(eventEmitted, true, 'Token as been minted');
        assert.equal(ownerReturnedByEvent, ownerToken, 'The token minted has the correct owner');
        assert.equal(tokenIdMinted, tokenId, 'The token has been minted');
    });

});


