const MediaManager = artifacts.require("./MediaManager.sol");
const { expectThrow } = require('./helpers/expectThrow');
// const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');

contract("MediaManager", accounts => {
    it("owner address should be the first address available.", async () => {
        const mediaManagerInstance = await MediaManager.deployed();

        // Checks if deployer address is the current owner of the contract
        const currentOwner = await mediaManagerInstance.owner.call();
        assert.equal(currentOwner, accounts[0], "First account is not the owner of the contract.");
    });

    it("should reject only owner calls from other addresses.", async () => {
        const mediaManagerInstance = await MediaManager.deployed();
        // Checks if foreign address can call only owner contract method
        await expectThrow(
            mediaManagerInstance.transferOwnership(accounts[2], {from: accounts[1]})
        );
    });
});
