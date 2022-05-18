// migrating the appropriate contracts
var SquareVerifier = artifacts.require("Verifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var RealEstateMarket = artifacts.require("RealEstateMarket");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(SquareVerifier);
  await deployer.deploy(SolnSquareVerifier);
  await deployer.deploy(RealEstateMarket);
};
