const MediaManager = artifacts.require("./MediaManager.sol");
const { expectThrow } = require('./helpers/expectThrow');
// const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');

contract("MediaManager", accounts => {
    // Initialize contract state before each test.
    let mediaManagerInstance;
    beforeEach(async function () {
        mediaManagerInstance = await MediaManager.new({ from: accounts[0] });
      });
    // global variables to use in all the tests
    let publicMediaHash;
    let mediaIndex;
    let mediaOwner;

    it("owner address should be the first address available.", async () => {
        // Checks if deployer address is the current owner of the contract
        const currentOwner = await mediaManagerInstance.owner.call();
        assert.equal(currentOwner, accounts[0], "First account is not the owner of the contract.");
    });

    it("should reject only owner calls from other addresses.", async () => {
        // Checks if foreign address can call only owner contract method
        await expectThrow(
            mediaManagerInstance.transferOwnership(accounts[2], {from: accounts[1]})
        );
    });

    it("should transfer ownership of the contract back and forth.", async () => {
        const owner = accounts[0];
        const newOwner = accounts[1];
        
        // Checks if owner can transfer ownership of the contract
        await mediaManagerInstance.transferOwnership(newOwner, {from: owner});
        let currentOwner = await mediaManagerInstance.owner.call();
        assert.equal(currentOwner, newOwner, "Ownership of the contract was not transferred.");

        // Checks if new owner can transfer ownership to the original
        // owner of the contract.
        await mediaManagerInstance.transferOwnership(owner, {from: newOwner});
        currentOwner = await mediaManagerInstance.owner.call();
        assert.equal(currentOwner, owner, "Ownership of the contract was not transferred.");
    });


    it("it should add, retrieve and delete a media file info.", async () => {
        const mediaFileHash = 'QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA';

        // Try adding a new media file
        const result = await mediaManagerInstance.addOwnedMedia(
            mediaFileHash,
            false,
            'Media file title',
            'Media file description',
            {from: accounts[0]}
        );
        // Get event data
        let evtData = result.logs[0].args;
        const publicMediaHash = evtData.publicMediaHash;
        mediaIndex = evtData.mediaIndex;
        mediaOwner = evtData.mediaOwner;

        // Verify that public hashes match.    
        // assert.equal(publicHash, publicMediaHash, "Hash from calling function must match the one returned from the event.");
        assert.equal(mediaIndex, 1, "The index of the first inserted file should be 1.");
        assert.equal(accounts[0], mediaOwner, "The owner off the added file should match the one using in the function call.");
    });
});
