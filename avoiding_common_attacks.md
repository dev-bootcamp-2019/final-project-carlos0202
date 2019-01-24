# Avoiding common attacks in My Media Collection

This section explains the different measures that were taken to prevent most of the common attacks that could suffer the deployed contracts by malicious users in Solidity contracts.  

We can effectively say that the main contract in this DApp is safe because there aren't any value transfer functions and the only interaction our users do is to upload media content and delete previously uploaded media if it belongs to them. Also, common race condition attacks don't apply here such as Reentrancy because there isn't any external call that handles ether. Even though the main interactions of the contract are relatively simple, the contract verifies IPFS generated hashes to avoid data duplication before saving it into the blockchain.

Also, the contract contains OpenZeppelin's `Pausable` functions to restrict execution of the sensitive functions in case of emergency, that prevents file add and delete while the contract state is paused. On the contrary, the `upgradeContract` functionality only works when the contract state is paused, to prevent data loss while upgrading our main contract using this method.

## Integer Overflow or Underflow

In order to be able to defend my contract implementations from this attack vector, the main `MediaManager.sol` contract contains imports of the `SafeMath.sol` contract from OpenZeppelin library that helps us to do safe mathematical basic operations (sum, subtract, multiply, and divide) checking for Overflow and Underflow of the results.

## Force sending Ether

The main contract contains a fallback function implemented to reject forcefully sending ether to the contract. Also, no call is made using `this.balance` that could suffer from this kind of attacks.

## Transaction-Ordering Dependence (TOD) | Front Running

Even though transaction order does matter for individual files being registered, it would be difficult for an attacker to have access to the same file hash and do another submission in a short span of seconds. This is mainly due to the difficulty to foresee when a new media file is about to be uploaded.

## Timestamp Dependence

Even though our contract barely uses `block.timestamp` to save the date when a media file was added, the accuracy is not required to be exact on a 30-seconds interval basis. Moreover, since the contract doesn't use any value transfer operation, any so-called attacker wouldn't have a good incentive to manipulate the timestamp on his favor.

## DoS with Block Gas Limit

The main contract `MediaManager.sol` doesn't have any loops in any function and because of that, this contract is invulnerable to usual attacks regarding block gas limit as there is usually the same amount of gas needed to execute the contract functions.
