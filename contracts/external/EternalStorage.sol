pragma solidity ^0.5.0;


import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title EternalStorage
 * @dev An ownable contract that can be used as a storage where the variables
 * are stored in a set of mappings indexed by hash name
 * Contract importing following the guidelines in the zeppelinos upgreadability
 * contracts post: 
 * https://github.com/zeppelinos/labs/tree/ff479995ed90c4dbb5e32294fa95b16a22bb99c8/upgradeability_using_eternal_storage
 * 
 *
 */
contract EternalStorage is Ownable {

    mapping(bytes32 => bool) _bool;
    mapping(bytes32 => int) _int;
    mapping(bytes32 => uint256) _uint;
    mapping(bytes32 => string) _string;
    mapping(bytes32 => address) _address;
    mapping(bytes32 => bytes) _bytes;

    /**
    * @dev The constructor sets the original `owner` of the
    * contract to the sender account.
    */
    constructor() public {
        Ownable(msg.sender);
    }

    /**
    * @dev Allows the owner to set a value for a boolean variable.
    * @param h The keccak256 hash of the variable name
    * @param v The value to be stored
    */
    function setBoolean(bytes32 h, bool v) external onlyOwner {
        _bool[h] = v;
    }

    /**
    * @dev Allows the owner to set a value for a int variable.
    * @param h The keccak256 hash of the variable name
    * @param v The value to be stored
    */
    function setInt(bytes32 h, int v) external onlyOwner {
        _int[h] = v;
    }

    /**
    * @dev Allows the owner to set a value for a boolean variable.
    * @param h The keccak256 hash of the variable name
    * @param v The value to be stored
    */
    function setUint(bytes32 h, uint256 v) external onlyOwner {
        _uint[h] = v;
    }

    /**
    * @dev Allows the owner to set a value for a address variable.
    * @param h The keccak256 hash of the variable name
    * @param v The value to be stored
    */
    function setAddress(bytes32 h, address v) external onlyOwner {
        _address[h] = v;
    }

    /**
    * @dev Allows the owner to set a value for a string variable.
    * @param h The keccak256 hash of the variable name
    * @param v The value to be stored
    */
    function setString(bytes32 h, string memory v) public onlyOwner {
        _string[h] = v;
    }

    /**
    * @dev Allows the owner to set a value for a bytes variable.
    * @param h The keccak256 hash of the variable name
    * @param v The value to be stored
    */
    function setBytes(bytes32 h, bytes memory v) public onlyOwner {
        _bytes[h] = v;
    }

    /**
    * @dev Get the value stored of a boolean variable by the hash name
    * @param h The keccak256 hash of the variable name
    */
    function getBoolean(bytes32 h) external view onlyOwner returns (bool){
        return _bool[h];
    }

    /**
    * @dev Get the value stored of a int variable by the hash name
    * @param h The keccak256 hash of the variable name
    */
    function getInt(bytes32 h) external view onlyOwner returns (int){
        return _int[h];
    }

    /**
    * @dev Get the value stored of a uint variable by the hash name
    * @param h The keccak256 hash of the variable name
    */
    function getUint(bytes32 h) external view onlyOwner returns (uint256){
        return _uint[h];
    }

    /**
    * @dev Get the value stored of a address variable by the hash name
    * @param h The keccak256 hash of the variable name
    */
    function getAddress(bytes32 h) external view onlyOwner returns (address){
        return _address[h];
    }

    /**
    * @dev Get the value stored of a string variable by the hash name
    * @param h The keccak256 hash of the variable name
    */
    function getString(bytes32 h) external view onlyOwner returns (string memory){
        return _string[h];
    }

    /**
    * @dev Get the value stored of a bytes variable by the hash name
    * @param h The keccak256 hash of the variable name
    */
    function getBytes(bytes32 h) external view onlyOwner returns (bytes memory){
        return _bytes[h];
    }

     /**** Delete Methods ***********/
    
    /// @param _key The key for the record
    function deleteAddress(bytes32 _key) external onlyOwner {
        _address[_key] = address(0);
        delete _address[_key];
    }

    /// @param _key The key for the record
    function deleteUint(bytes32 _key) external onlyOwner {
        delete _uint[_key];
    }

    /// @param _key The key for the record
    function deleteString(bytes32 _key) external onlyOwner {
        _string[_key] = "";
        delete _string[_key];
    }

    /// @param _key The key for the record
    function deleteBytes(bytes32 _key) external onlyOwner {
        delete _bytes[_key];
    }
    
    /// @param _key The key for the record
    function deleteBool(bytes32 _key) external onlyOwner {
        delete _bool[_key];
    }
    
    /// @param _key The key for the record
    function deleteInt(bytes32 _key) external onlyOwner {
        delete _int[_key];
    }
}