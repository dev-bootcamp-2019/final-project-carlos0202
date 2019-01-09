var EternalStorage = artifacts.require("./external/EternalStorage.sol");
var MediaManager = artifacts.require("./MediaManager.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(EternalStorage);
    deployer.deploy(MediaManager);
};
