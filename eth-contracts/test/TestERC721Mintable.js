var ERC721MintableComplete = artifacts.require('RealEstateMarket');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
            this.tokenIDs = new Array(1113,2813,6544,7674,8090,8308,8386,9427,9479,9698);

            // TODO: mint multiple tokens
            for(var i = 0; i < this.tokenIDs.length; i++) {
                await this.contract.mint(account_one, this.tokenIDs[i]);
            }
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply, this.tokenIDs.length, 'Total supply returns the correct value');
        })

        it('should get token balance', async function () { 
            let tokenBalance = await this.contract.balanceOf(account_one);
            assert.equal(tokenBalance, this.tokenIDs.length, 'Token balance returns the correct value');
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let baseURI = await this.contract.baseTokenURI();
            let token = this.tokenIDs[2]; // 6544
            let tokenURI = baseURI + token;
            let tokenURIContract = await this.contract.tokenURI(token);

            assert.equal(tokenURIContract, tokenURI, 'Token URI is correct');
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_one, account_two, this.tokenIDs[0]);

            // Declare and Initialize a variable for event
            var eventEmitted = false
            
            // Watch the emitted event Stored()
            this.contract.Transfer({}, function(err, res) {
                eventEmitted = true
            });

            let newOwner = await this.contract.ownerOf(this.tokenIDs[0]);
            assert.equal(newOwner, account_two, 'Token has been transferred');
            assert.equal(eventEmitted, true, 'Event has been emmited');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            var reason;
            let failed = false;
            let tokenId = 2899;
            let contractOwner = await this.contract.contractOwner();
            
            try {
                await this.contract.mint(account_one, tokenId, {from: account_two});
            } 
            catch(e) {
                reason = e.reason;
                failed = true;
            }

            assert.equal(failed, true, "Mint failed when the caller is not the owner");
            assert.equal(reason, "Caller is not the contract owner", "The mint failed for the correct reason");
        })

        it('should return contract owner', async function () { 
            let contractOwner = await this.contract.contractOwner();
            assert.equal(contractOwner, account_one, 'Contract has return the contract owner');
        })

    });
})