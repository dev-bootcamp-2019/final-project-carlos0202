const MediaManager = artifacts.require("./MediaManager.sol");
const {
    expectThrow
} = require('./helpers/expectThrow');
// const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');

contract("MediaManager", accounts => {
    // Initialize contract state before each test.
    let mediaManagerInstance;
    beforeEach(async function () {
        mediaManagerInstance = await MediaManager.new({
            from: accounts[0]
        });
    });
    // global variables to use in all the tests
    let publicMediaHash;
    let mediaIndex;
    let mediaOwner;
    const mediaFileHash = 'QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA';

    it("owner address should be the first address available.", async () => {
        // Checks if deployer address is the current owner of the contract
        const currentOwner = await mediaManagerInstance.owner.call();
        assert.equal(currentOwner, accounts[0], "First account is not the owner of the contract.");
    });

    it("should reject only owner calls from other addresses.", async () => {
        // Checks if foreign address can call only owner contract method
        await expectThrow(
            mediaManagerInstance.transferOwnership(accounts[2], {
                from: accounts[1]
            })
        );
    });

    it("should transfer ownership of the contract back and forth.", async () => {
        const owner = accounts[0];
        const newOwner = accounts[1];

        // Checks if owner can transfer ownership of the contract
        await mediaManagerInstance.transferOwnership(newOwner, {
            from: owner
        });
        let currentOwner = await mediaManagerInstance.owner.call();
        assert.equal(currentOwner, newOwner, "Ownership of the contract was not transferred.");

        // Checks if new owner can transfer ownership to the original
        // owner of the contract.
        await mediaManagerInstance.transferOwnership(owner, {
            from: newOwner
        });
        currentOwner = await mediaManagerInstance.owner.call();
        assert.equal(currentOwner, owner, "Ownership of the contract was not transferred.");
    });


    it("it should add, retrieve and delete a media file info.", async () => {
        // Try adding a new media file
        const result = await mediaManagerInstance.addOwnedMedia(
            mediaFileHash,
            true,
            "Media file title",
            "Media file description", {
                from: accounts[1]
            }
        );
        // Get event data
        let evtData = result.logs[0].args;
        publicMediaHash = evtData.publicMediaHash;
        mediaIndex = evtData.mediaIndex;
        mediaOwner = evtData.mediaOwner;

        // Verify that public hashes match.    
        assert.equal(mediaIndex, 1, "The index of the first inserted file should be 1.");
        assert.equal(accounts[1], mediaOwner, "The owner off the added file should match the one using in the function call.");

        // Try getting the file that has been just inserted using another user.
        let mediaInfo = await mediaManagerInstance.getMedia.call(mediaIndex, {
            from: accounts[2]
        });

        assert.equal(mediaFileHash, mediaInfo.mediaHash, "Media file hash must match the one used to insert the file.");
        assert.equal("Media file title", mediaInfo.title, "Title must match the media title stored.");
        assert.equal(mediaOwner, mediaInfo.mediaOwner, "The owner of the media file should be the one that added the file.");

        // Try deleting record by other address than the owner itself.
        // Must fail if it's not the right address
        await expectThrow(
            mediaManagerInstance.deleteOwnedMedia(publicMediaHash, {
                from: accounts[2]
            }),
            "Only the owner of the media file can delete it!"
        );

        // Try deleting record using its real owner.
        let response = await mediaManagerInstance.deleteOwnedMedia(publicMediaHash, {
            from: accounts[1]
        });
        evtData = response.logs[0];
        assert.equal(evtData.event, "MediaDeleted", "The event was not emited successfully");
        assert.equal(evtData.args.mediaOwner, accounts[1], "The resulting owner of the event should be the owner.");

        // Try getting the file that has been just deleted using another user.
        // The result must be a throw with the error of require telling that the 
        // media index should be greater than 0.
        await expectThrow(
            mediaManagerInstance.getMediaByPublicHash(publicMediaHash, {
                from: accounts[2]
            }),
            "Media index must be greater than 0."
        );
        // Searching the media file by its index must throw an error as well
        // indicating that the media was not found.
        await expectThrow(
            mediaManagerInstance.getMedia(mediaIndex, {
                from: accounts[2]
            }),
            "Media file not found or it's not assigned to the right owner."
        );
    });

    it("check for non saved media in storage should return false.", async () => {
        let mediaIndex = 1;
        // Try getting the file that has been just deleted using another user.
        // The result must be a throw with the error of require telling that the 
        // media index should be greater than 0.
        await expectThrow(
            mediaManagerInstance.getMedia(mediaIndex, {
                from: accounts[2]
            }),
            "Media file not found or it's not assigned to the right owner."
        );
    });

    it("call to marked functions on paused state should throw an error.", async () => {
        // change machine state in contract to paused so that marked functions
        // should not be executed while in paused state.
        await mediaManagerInstance.pause({
            from: accounts[0]
        });

        // Adding a media file can only be done while the state machine is not
        // in paused state, so the next call should throw an error.
        await expectThrow(
            mediaManagerInstance.addOwnedMedia(
                mediaFileHash,
                true,
                "Media file title",
                "Media file description", {
                    from: accounts[1]
                }
            )
        );

        // change machine state in contract to not paused so that marked functions
        // should be executed again.
        await mediaManagerInstance.unpause({
            from: accounts[0]
        });

        // Try adding a new media file once again. It should be possible now
        // that the state machine is not in paused state.
        const result = await mediaManagerInstance.addOwnedMedia(
            mediaFileHash,
            true,
            "Media file title",
            "Media file description", {
                from: accounts[1]
            }
        );
        // Get event data
        let evtData = result.logs[0].args;
        mediaIndex = evtData.mediaIndex;
        mediaOwner = evtData.mediaOwner;

        // Verify that public hashes match.    
        assert.equal(mediaIndex, 1, "The index of the first inserted file should be 1.");
        assert.equal(accounts[1], mediaOwner, "The owner off the added file should match the one using in the function call.");
    });
});