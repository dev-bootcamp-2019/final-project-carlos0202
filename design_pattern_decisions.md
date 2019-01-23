# Design patterns used in My Media Collection

This section has a list of design patterns decisions taken while developing the __*My Media Collection DApp*__, and a brief description of how have been implemented and which functions follow these design patterns.

## Restricting Access

The main contract, MediaManager.sol, imports the tested `Ownable` library from OpenZeppelin, that allows us to restrict access to core functionalities like __*upgradeContract*__, and pausable methods, only to the contract owner.

## Fail early and fail loud

Most of the functions have `require()` modifiers that checks if the calls meet the needed conditions as early as possible inside the function body, to throw an error early if the required conditions are not met. Some examples of functions using this pattern are:
  * *upgradeContract* 
  * *addOwnedMedia* 
  * *deleteOwnedMedia* 
  * *getMedia*
  * *getUserMedia*
  
## Circuit breaker

There is a circuit breaker implemented in `MediaManager.sol`, using the `Pausable` library from OpenZeppelin, that can be triggered by the contract owner to allow only certain functions to be executable based on the current state of the circuit breaker, in case there is a malfunction, or the contract is being hacked.

If the contract is `Paused`, the following methods cannot be called:
  * *addOwnedMedia* 
  * *deleteOwnedMedia*
 
If the contract is not paused, the following methods cannot be called:
  * *upgradeContract*
  
## [Eternal Storage](https://fravoll.github.io/solidity-patterns/eternal_storage.html)

To store the data on the blockchain, I have moved the state variables to another contract called `EternalStorage.sol` who is responsible of storing all the data that the DApp uses in a way that we can store and retrieve any kind of structure by using mappings of the different types of primitive values using a variable **bytes32** hash as the key. 

Our Eternal Storage implementation also uses OpenZeppelin's `Ownable` constraints to disallow any unintended change of state for any address other than the owner defined while instantiating the contract constructor, or by using the `transferOwnership` method from the `Ownable` implementation. 

## Which other patterns i could have used

Although I have used quite a good amount of patterns to develop my solution, there are other patterns that I could add in the future to enhance project upgradability and security that weren't included in this version to maintain simplicity while complying with the requirements of the final project. These 'should add' patterns includes:

### [Proxy contract pattern](https://blog.zeppelinos.org/proxy-patterns/):

Using a proxy architecture pattern will help the existing Eternal Storage Pattern and the main contract to be upgraded with fewer frictions by using a layer for client calls and make the logic in our main contract abstract to the different clients. Also, implementing a good proxy pattern could help us to choose between different storage solutions rather than only relying on our Eternal Storage pattern.

## Why not other patterns

I didn't use any other patterns because the ones already chosen can offer the level of security and scalability that I wanted to achieve for this project and because I felt that adding more patterns could do more harm than good to the implementation in terms of code simplicity and readability that was already a little bit compromised by using the Eternal Storage pattern.

# Coding standards

All the code inside the `MediaManager.sol` contract has been written using the formal **Solidity Style Guide** documentation available [here](https://solidity.readthedocs.io/en/v0.5.0/style-guide.html).




