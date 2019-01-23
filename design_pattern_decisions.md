# Design patterns used in My Media Collection

This section has a list of design patterns decisions taken while developing the __*My Media Collection DApp*__, and a brief description of how have been implemented and which functions follow these design patterns.

## Restricting Access

The main contract, MediaManager.sol, imports the tested Ownable library from OpenZeppelin, that allows us to restrict access to core functionalities like __*upgradeContract*__, and pausable methods, only to the contract owner.

## Fail early and fail loud

Most of the functions have modifiers that checks if the calls meet the needed conditions as early as possible inside the function body, to throw an error early if the required conditions are not met. Some examples of functions using this pattern are:
  * *upgradeContract* 
  * *addOwnedMedia* 
  * *deleteOwnedMedia* 
  * *getMedia*
  * *getUserMedia*
  
## Circuit breaker

There is a circuit breaker implemented in MediaManager.sol, using the Pausable library from OpenZeppelin, that can be triggered by the contract owner to allow only certain functions to be executable based on the current state of the circuit breaker, in case there is a malfunction, or the contract is being hacked.

If the contract is Paused, the following methods cannot be called:
  * *addOwnedMedia* 
  * *deleteOwnedMedia*
 
If the contract is not paused, the following methods cannot be called:
  * *upgradeContract*
  
## Eternal Storage

To store the data on the blockchain, I have moved the state variables to another contract called __*EternalStorage.sol*__ who is responsible of storing all the data that the DApp uses in a way that we can store and retrieve any kind of structure by using mappings of the different types of primitive values using a variable **bytes32** hash as the key. Our Eternal Storage implementation also uses OpenZeppelin's Ownable constraints to disallow any unintended change of state for any address other than the owner defined while instantiating the contract constructor, or by using the transfertOwnership method from the Ownable implementation. 
