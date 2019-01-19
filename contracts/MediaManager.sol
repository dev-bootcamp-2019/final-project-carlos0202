pragma solidity ^0.5.0;


import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "./external/EternalStorage.sol";


/** @title Media Manager contract using Proof of Existence to validate ownership.
  * This contract uses zeppelin's Ownable and Pausable imports to manage owner capabilities
  * and pause the sensitive functionalities of the contract when necessary.
  *
  * The information stored using this contract is put into a EternalStorage variable
  * to allow upgradeability of the contract while preserving state data following
  * zeppelinos guidelines about EternalStorage.
  */
contract MediaManager is Ownable, Pausable{
    // Type declarations of the contract
    using SafeMath for uint;
    
    // State variables of the contract
    EternalStorage internal db;

    // Events of the contract
    event MediaAdded(
        string mediaHash, 
        uint indexed mediaIndex, 
        address indexed mediaOwner
    );
    event MediaDeleted(
        string mediaHash, 
        uint indexed mediaIndex, 
        address indexed mediaOwner
    );
    event ContractTransferred(address indexed oldAddress, address indexed newAddress);

    // Contract's constructor
    constructor() public {
        Ownable(msg.sender);
        db = new EternalStorage();
        // initialize mapping indexes to use while saving or retrieving proof data
        // from EternalStorage.
        // Store index of last added media. 
        // (set at 0 because no media exists when first instantiated)
        db.setUint(getHashIndex("lastMediaIndex"), 0);
    }

    /** @dev Fallback to reject any ether sent to contract
    */
    function () external { }

    // Public functions
    /** @dev Give the contract proxy to a new contract by allowing it to manipulate storage.
    * This function execution was marked to be only possible when the contract's state
    * machine is in paused state.  That means that access to sensitive functionality in the
    * contract should be paused prior to call this function.
    * @param newAddress the address of new contract proxy deployed.
    * @return success If the transaction is processed successfully
    */
    function upgradeContract(address newAddress)
        public 
        onlyOwner 
        whenPaused 
        returns (bool success) 
    {
        require(newAddress != address(0), "should provide a valid address to upgrade.");        
        // Emit the corresponding event
        emit ContractTransferred(owner(), newAddress);
        // Transfer ownership of the state data to the new address
        db.transferOwnership(newAddress);

        return true;
    }

    // Internal functions
    /** @dev Computes the hash to use as index to store a value in the .
    * @param mappingName the name to use if we want to have some structured
    * information pattern like struct while saving data in the EternalStorage.
    * @param index the index to use for the structured data collection index
    * in the storage.
    * @param varName a name to have as reference for the variable inside the
    * mapping like a property of a struct in terms of reference.
    * @return the hash to use as index for the corresponding mapping inside
    * the EternalStorage.
    */
    function getHashIndex(string memory mappingName, uint index, string memory varName) 
        internal 
        pure 
        returns (bytes32 nHash) 
    {
        nHash = keccak256(abi.encodePacked(mappingName, index, varName));
    }

    /** @dev Computes the hash to use as index to store a value in the .
    * @param mappingName the name to use if we want to have some structured
    * information pattern like struct while saving data in the EternalStorage.
    * @param ownerAddress the owner of the resource to calculate this hash.
    * @param varName a name to have as reference for the variable inside the
    * mapping like a property of a struct in terms of reference.
    * @return the hash to use as index for the corresponding mapping inside
    * the EternalStorage.
    */
    function getHashIndex(
        string memory mappingName, 
        address ownerAddress, 
        string memory varName
    ) 
        internal 
        pure 
        returns (bytes32 nHash) 
    {
        nHash = keccak256(abi.encodePacked(mappingName, ownerAddress, varName));
    }

    /** @dev Computes the hash to use as index to store a value in the .
    * @param mappingName the name to use if we want to have some structured
    * information pattern like struct while saving data in the EternalStorage.
    * @param ownerAddress the owner of the resource to calculate this hash.
    * @param varName a name to have as reference for the variable inside the
    * mapping like a property of a struct in terms of reference.
    * @return the hash to use as index for the corresponding mapping inside
    * the EternalStorage.
    */
    function getHashIndex(string memory mappingName, address ownerAddress, uint varName) 
        internal 
        pure 
        returns (bytes32 nHash) 
    {
        nHash = keccak256(abi.encodePacked(mappingName, ownerAddress, varName));
    }

    /** @dev Computes the hash to use as index to store a value in the .
    * @param mappingName the name to use if we want to have some structured
    * information pattern like struct while saving data in the EternalStorage.
    * @param varName a name to have as reference for the variable inside the
    * mapping like a property of a struct in terms of reference.
    * @return the hash to use as index for the corresponding mapping inside
    * the EternalStorage.
    */
    function getHashIndex(string memory mappingName, string memory varName) 
        internal 
        pure 
        returns (bytes32 nHash) 
    {
        nHash = keccak256(abi.encodePacked(mappingName, varName));
    }

    /** @dev Computes the hash to use as index to store a value in the .
    * @param mappingName the name to use if we want to have some structured
    * information pattern like struct while saving data in the EternalStorage.
    * @return the hash to use as index for the corresponding mapping inside
    * the EternalStorage.
    */
    function getHashIndex(string memory mappingName) 
        internal 
        pure 
        returns (bytes32 nHash) 
    {
        nHash = keccak256(abi.encodePacked(mappingName));
    }

    /** @dev Reads the owner of a media file in the given index from storage.
    * @param mediaIndex the index id stored for the media file.
    * @return the address of the owner of this media file if found.
    */
    function getMediaOwner(uint mediaIndex) 
        internal 
        view 
        returns (address mediaOwner) 
    {
        // Get the owner address of the media
        mediaOwner = db.getAddress(getHashIndex("mediaMap", mediaIndex, "mediaOwner"));
    }
    
    /** @dev Registers an IPFS file hash and its extra data to  the contract's storage.
    * @param mediaHash the IPFS file hash to register.
    * @param isVideo determines if the hash stored corresponds to a video uploaded to IPFS.
    * @param title a title to give to the upload media for screening purposes.
    * @param tags list of tags relevant to the uploaded media.
    * @return the index of the newly added media file.
    */
    function addOwnedMedia(
        string memory mediaHash, 
        bool isVideo, 
        string memory title, 
        string memory tags
    ) 
        public 
        whenNotPaused() 
        returns (uint mediaFileIndex) 
    {
        // The same media cannot be added twice
        require(
            db.getUint(getHashIndex("mediaHashMap", mediaHash)) == 0, 
            "Media file should not exists."
        );

        // The owner should be a valid address
        require(
            msg.sender != address(0),
            "The owner address must be a valid one!!!"
        ); 
        // Get saved media index count starting at 0 and add 1 to insert first at 1;
        uint mediaIndex = db.getUint(getHashIndex("lastMediaIndex")).add(1);
        // Get saved media index for current caller of the method.
        uint userMediaIndex = db.getUint(
            getHashIndex("userMediaMap", msg.sender, "userMediaIndex")
        );
        // Get the public hash that will be used as a reference for the stored
        // media file instead of using the IPFS hash directly.
        bytes32 hashIndex = getHashIndex("mediaHashMap", mediaHash);

        // Save main information aboud the media file to add
        // Save wether the uploaded media is a video property.
        db.setBoolean(getHashIndex("mediaMap", mediaIndex, "isVideo"), isVideo);
        // Save the associated title to the media.
        db.setString(getHashIndex("mediaMap", mediaIndex, "title"), title);
        // Save the tags associated to the media.
        db.setString(getHashIndex("mediaMap", mediaIndex, "tags"), tags);
        // Save the timestamp of this transaction in the mapping
        db.setUint(getHashIndex("mediaMap", mediaIndex, "timestamp"), now);
        // Save the media hash obtained fro IPFS
        db.setString(getHashIndex("mediaMap", mediaIndex, "mediaHash"), mediaHash);
        // Save the owner address of the media
        db.setAddress(getHashIndex("mediaMap", mediaIndex, "mediaOwner"), msg.sender);

        // Save information regarding the map of users and its media files.
        // Store the reference of the current media file associated with a 
        // key created using the users address and the current index in the map.
        db.setUint(getHashIndex("userMediaMap", msg.sender, userMediaIndex), mediaIndex);
        db.setUint(getHashIndex("userMediaMapIndex", msg.sender, mediaIndex), userMediaIndex);
        // map usersmediaindex with mediaindex of the file
        // map owner to the current mediaIndex beign inserted.
        db.setUint(getHashIndex("userMediaMap", msg.sender, mediaIndex), mediaIndex);
        // update the count of files for the current owner
        db.setUint(getHashIndex("userMediaCount", msg.sender, "totalFiles"), userMediaIndex == 0 ? 1: userMediaIndex.add(1));
        // Store the index for the next media file to add in the map array.
        db.setUint(
            getHashIndex("userMediaMap", msg.sender, "userMediaIndex"), 
            userMediaIndex.add(1)
        );

        // Save index information of the media hash and its current position in the maps.
        // Save current media index with the hash as its key
        db.setUint(hashIndex, mediaIndex);
        // Update info regarding the last inserterd media index
        db.setUint(getHashIndex("lastMediaIndex"), mediaIndex);

        // emit corresponding event
        emit MediaAdded(mediaHash, mediaIndex, msg.sender);

        return mediaIndex;
    }

    /** @dev Deletes an IPFS file hash and its extra data of the contract's storage.
    * @param mediaHash the IPFS file hash to delete.
    * @return boolean value indicating that the delete operation was successsful.
    */
    function deleteOwnedMedia(string memory mediaHash) 
        public 
        whenNotPaused() 
        returns (bool mediaDeleted) 
    {
        bytes32 hashIndex = getHashIndex("mediaHashMap", mediaHash);
        // Get saved media index of the media file.
        uint mediaIndex = db.getUint(hashIndex);
        // The media file must exists in the storage.
        require(mediaIndex != 0, "The media file to delete must exist!");
        // The owner of the media file must be the one calling this method
        require(
            getMediaOwner(mediaIndex) == msg.sender,
            "Only the owner of the media file can delete it!"
        );

        // Get saved media index for current caller of the method.
        uint userMediaIndex = db.getUint(
            getHashIndex("userMediaMapIndex", msg.sender, mediaIndex)
        );

        // Delete main information aboud the media file
        // Delete is a video property.
        db.deleteBool(getHashIndex("mediaMap", mediaIndex, "isVideo"));
        // Delete the associated title to the media.
        db.deleteString(getHashIndex("mediaMap", mediaIndex, "title"));
        // Delete the tags associated to the media.
        db.deleteString(getHashIndex("mediaMap", mediaIndex, "tags"));
        // Delete the timestamp of this transaction in the mapping
        db.deleteUint(getHashIndex("mediaMap", mediaIndex, "timestamp"));
        // Delete the media hash obtained fro IPFS
        db.deleteString(getHashIndex("mediaMap", mediaIndex, "mediaHash"));
        // Delete the owner address of the media
        db.deleteAddress(getHashIndex("mediaMap", mediaIndex, "mediaOwner"));

        // delete information regarding the map of users and its media files.
        // delete the reference of the current media file associated with a 
        // key created using the users address and the current index in the map.
        db.deleteUint(getHashIndex("userMediaMap", msg.sender, userMediaIndex));
        // delete current mediaIndex associated with usersMedia array index
        db.deleteUint(getHashIndex("userMediaMap", msg.sender, mediaIndex));
        db.deleteUint(getHashIndex("userMediaMapIndex", msg.sender, mediaIndex));
        // Delete current media index with the hash as its key
        db.deleteUint(hashIndex);
        // update the count of files for the current owner
        uint currCount = db.getUint(getHashIndex("userMediaCount", msg.sender, "totalFiles"));
        db.setUint(getHashIndex("userMediaCount", msg.sender, "totalFiles"), currCount.sub(1));

        // emit corresponding event
        emit MediaDeleted(mediaHash, mediaIndex, msg.sender);
        mediaDeleted = true;

        return mediaDeleted;
    }    

    /** @dev Returns all the information stored about the media file in the corresponding
    * index sent as parameter.
    * @param mediaIndex - index of registered media file in the storage.
    * @return the media file is a video (isVideo).
    * @return associated title of the media file (title).
    * @return associated tags of the media file (tags).
    * @return the timestamp when media file was saved in the blockchain.
    * @return the media file hash obtained fro IPFS.
    * @return the address of the owner of this media file.
    */
    function getMedia(uint mediaIndex) public view returns (
        bool isVideo,
        string memory title,
        string memory tags,
        uint timestamp,
        string memory mediaHash,
        address mediaOwner
    ) {
        require(mediaIndex > 0, "Media index must be greater than 0.");
        // Get the owner address of the media
        mediaOwner = db.getAddress(getHashIndex("mediaMap", mediaIndex, "mediaOwner"));
        require(
            mediaOwner != address(0) && 
            db.getUint(getHashIndex("userMediaMap", mediaOwner, mediaIndex)) == mediaIndex,
            "Media file not found or it's not assigned to the right owner."
        );
        // Get information aboud the media file added
        // Get is a video property.
        isVideo = db.getBoolean(getHashIndex("mediaMap", mediaIndex, "isVideo"));
        // Get the associated title to the media.
        title = db.getString(getHashIndex("mediaMap", mediaIndex, "title"));
        // Get the tags associated to the media.
        tags = db.getString(getHashIndex("mediaMap", mediaIndex, "tags"));
        // Get the timestamp of this transaction in the mapping
        timestamp = db.getUint(getHashIndex("mediaMap", mediaIndex, "timestamp"));
        // Get the media hash obtained fro IPFS
        mediaHash = db.getString(getHashIndex("mediaMap", mediaIndex, "mediaHash"));
        

        return (isVideo, title, tags, timestamp, mediaHash, mediaOwner);
    }

    /** @dev Returns all the information stored about a media file given a media owner and 
    * the index of the media file in user's media array.
    * @param mediaOwner Address of the media owner.
    * @param mediaIndex - Index of saved media file in user's media array.
    * @return the media file is a video (isVideo).
    * @return associated title of the media file (title).
    * @return associated tags of the media file.
    * @return the timestamp when media file was saved in the blockchain.
    * @return the media file hash obtained fro IPFS.
    * @return the address of the owner of this media file.
    */
    function getUserMedia(address mediaOwner, uint mediaIndex) public view returns (
        bool isVideo,
        string memory title,
        string memory tags,
        uint timestamp,
        string memory mediaHash,
        address owner
    ) {
        // Get the count of files added by the user
        uint userMediaIndex = db.getUint(getHashIndex("userMediaMap", msg.sender, "userMediaIndex"));

        require(mediaIndex.sub(1) <= userMediaIndex, "Media index not found for this owner.");
        // Get the media index associated form the users's media array
        uint _mediaIndex = db.getUint(getHashIndex("userMediaMap", mediaOwner, mediaIndex));
        // verify the index and check for overflow/underflow.        

        // return the associated media file.
        return getMedia(_mediaIndex);
    }

    /** @dev Shortcut utility function to check wether a media file hash has been inserted
    * in the storage using the IPFS media file hash to check for existence.
    * @param mediaHash the IPFS file hash to verify.
    * @return boolean indicating if media file exists.
    */
    function checkIfExists(string memory mediaHash) public view returns (bool mediaExists) {
        mediaExists = db.getUint(getHashIndex("mediaHashMap", mediaHash)) > 0;
    }

    /** @dev Shortcut utility function to read a media file's index by its hash.
    * @param mediaHash the IPFS media file hash registered.
    * @return uint media file index if exists or zero (0).
    */
    function getMediaIndexByHash(string memory mediaHash) public view returns (uint mediaIndex) {
        mediaIndex = db.getUint(getHashIndex("mediaHashMap", mediaHash));
    }

     /** @dev Shortcut utility function to get all the information of a given media file
    * by using its media hash to obtain the data.
    * @param mediaFileHash the IPFS media file hash saved.
    * @return the media file is a video (isVideo).
    * @return associated title of the media file (title).
    * @return associated tags of the media file.
    * @return the timestamp when media file was saved in the blockchain.
    * @return the media file hash obtained fro IPFS.
    * @return the address of the owner of this media file.
    */
    function getMediaByMediaHash(string memory mediaFileHash) public view returns (
        bool isVideo,
        string memory title,
        string memory tags,
        uint timestamp,
        string memory mediaHash,
        address mediaOwner
    ) {
        return getMedia(getMediaIndexByHash(mediaFileHash));
    }

    /** @dev Reads the last inserted media file index from storage.
    * @return Last inserted media file index.
    */
    function lastMediaIndex() public view returns (uint) {
        return db.getUint(getHashIndex("lastMediaIndex"));
    }
    
    function getUserMediaIndex() public view returns (uint totalAddedFiles, uint currentFilesCount) {
        return (
            db.getUint(getHashIndex("userMediaMap", msg.sender, "userMediaIndex")),
            db.getUint(getHashIndex("userMediaCount", msg.sender, "totalFiles"))
        );
    }
}
