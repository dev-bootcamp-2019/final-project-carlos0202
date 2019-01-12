const MediaManager = artifacts.require("./MediaManager.sol");
const truffleAssert = require('truffle-assertions');

contract("MediaManager", accounts => {
    // Initialize contract state before each test.
    let mediaManagerInstance;
    before(async function () {
        mediaManagerInstance = await MediaManager.new({
            from: accounts[0]
        });
    });
    // global variables to use in all the tests
    let publicMediaHash;
    let mediaIndex;
    let mediaOwner;
    const mediaFileHash = 'QmT4AeWE9Q9EaoyLJiqaZuYQ8mJeq4ZBncjjFH9dQ9uDVA';

    describe("Ownership of the contract tests.", async() => {
        it("owner address should be the first address available.", async () => {
            // Checks if deployer address is the current owner of the contract
            const currentOwner = await mediaManagerInstance.owner.call();
            assert.equal(currentOwner, accounts[0], "First account is not the owner of the contract.");
        });
    });
    
    describe("Zeppelin's Ownable implementation tests.", async() => {
        it("should reject only owner calls from other addresses.", async () => {
            // Checks if foreign address can call only owner contract method
            await truffleAssert.fails(
                mediaManagerInstance.transferOwnership(accounts[2], {
                    from: accounts[1]
                }),
                truffleAssert.ErrorType.REVERT
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
    });

    describe("Media file common operations tests", async () => {
        it("it should add a media file along with its info", async () => {
            // Try adding a new media file
            const result = await mediaManagerInstance.addOwnedMedia(
                mediaFileHash,
                true,
                "Media file title",
                "Media file description", {
                    from: accounts[1]
                }
            );

            await truffleAssert.eventEmitted(result, 'MediaAdded', (ev) => {
                publicMediaHash = ev.publicMediaHash;
                mediaIndex = ev.mediaIndex;
                mediaOwner = ev.mediaOwner;

                return ev.mediaIndex == 1 && ev.mediaOwner == accounts[1];
            }, 'MediaAdded event should be emitted with correct parameters');
        });

        it("it should retrieve an already added media file.", async () => {
            // Try getting the file that has been just inserted using another user.
            let mediaInfo = await mediaManagerInstance.getMedia.call(mediaIndex, {
                from: accounts[2]
            });

            assert.equal(mediaFileHash, mediaInfo.mediaHash, "Media file hash must match the one used to insert the file.");
            assert.equal("Media file title", mediaInfo.title, "Title must match the media title stored.");
            assert.equal(mediaOwner, mediaInfo.mediaOwner, "The owner of the media file should be the one that added the file.");
        });

        it("it should prevent deleting a media file if it's not its owner.", async() => {
            // Try deleting record by other address than the owner itself.
            // Must fail if it's not the right address
            await truffleAssert.fails(
                mediaManagerInstance.deleteOwnedMedia(publicMediaHash, {
                    from: accounts[2]
                }),
                truffleAssert.ErrorType.REVERT,
                "Only the owner of the media file can delete it!"
            );
        });

        it("it should allow media deletion to its owner.", async () => {
            // Try deleting record using its real owner.
            let response = await mediaManagerInstance.deleteOwnedMedia(publicMediaHash, {
                from: accounts[1]
            });
            // Check that event was emitted with the relevant data.
            await truffleAssert.eventEmitted(response, 'MediaDeleted', (ev) => {

                return ev.mediaOwner == accounts[1];
            }, 'MediaDeleted event should be emitted with correct parameters');
        });

        it("try getting a media file that doesn't exists should throw an error.", async () => {
            // Try getting the file that has been just deleted using another user.
            // The result must be a throw with the error of require telling that the 
            // media index should be greater than 0.
            await truffleAssert.fails(
                mediaManagerInstance.getMediaByPublicHash(publicMediaHash, {
                    from: accounts[2]
                }),
                truffleAssert.ErrorType.REVERT,
                "Media index must be greater than 0."
            );

            // Searching the media file by its index must throw an error as well
            // indicating that the media was not found.
            await truffleAssert.fails(
                mediaManagerInstance.getMedia(mediaIndex, {
                    from: accounts[2]
                }),
                truffleAssert.ErrorType.REVERT,
                "Media file not found or it's not assigned to the right owner."
            );
        });

        it("check for non saved media in storage should return false.", async () => {
            let mediaIndex = 1;
            // Try getting the file that has been just deleted using another user.
            // The result must be a throw with the error of require telling that the 
            // media index should be greater than 0.
            await truffleAssert.fails(
                mediaManagerInstance.getMedia(mediaIndex, {
                    from: accounts[2]
                }),
                truffleAssert.ErrorType.REVERT,
                "Media file not found or it's not assigned to the right owner."
            );
        });
    });

    describe("Zeppelin's Pausable implementation tests.", async () => {
        it("Calling pause from contract's owner should set state to paused", async () => {
            // change machine state in contract to paused so that marked functions
            // should not be executed while in paused state.
            let result = await mediaManagerInstance.pause({
                from: accounts[0]
            });

             // Check that event was emitted with the relevant data.
             await truffleAssert.eventEmitted(result, 'Paused', (ev) => {

                return ev.account == accounts[0];
            }, 'Paused event should be emitted with correct parameters');
        });

        it("Executing functions that require non paused state should throw an error", async () => {
            // Adding a media file can only be done while the state machine is not
            // in paused state, so the next call should throw an error.
            await truffleAssert.fails(
                mediaManagerInstance.addOwnedMedia(
                    mediaFileHash,
                    true,
                    "Media file title",
                    "Media file description", {
                        from: accounts[1]
                    }
                ),
                truffleAssert.ErrorType.REVERT
            );
        });

        it("Calling unpause from contract's owner should set state to unpaused", async () => {
            // change machine state in contract to not paused so that marked functions
            // should be executed again.
            let result = await mediaManagerInstance.unpause({
                from: accounts[0]
            });

             // Check that event was emitted with the relevant data.
             await truffleAssert.eventEmitted(result, 'Unpaused', (ev) => {

                return ev.account === accounts[0];
            }, 'Unpaused event should be emitted with correct parameters');
        });

        it("Executing functions that require non paused state should pass.", async () => {
            // Try adding a new media file once again. It should be possible now
            // that the state machine is not in paused state.
            const result = await mediaManagerInstance.addOwnedMedia(
                mediaFileHash,
                true,
                "Media file title",
                "Media file description", {
                    from: accounts[2]
                }
            );

            await truffleAssert.eventEmitted(result, 'MediaAdded', (ev) => {

                return ev.mediaIndex == 2 && ev.mediaOwner == accounts[2];
            }, 'MediaAdded event should be emitted with correct parameters');
        });
    });
});