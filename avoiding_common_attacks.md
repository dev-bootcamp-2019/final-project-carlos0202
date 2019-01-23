# Avoiding common attacks in My Media Collection

This section explains the different measures that were taken to prevent most of the common attacks that could suffer the deployed contracts by  malicious users in Solidity contracts.  

## Integer Overflow or Underflow

In order to be able to defend my contract implementaions from this attack vector, the main `MediaManager.sol` contract contains imports of the `SafeMath.sol` contract from OpenZeppelin library that helps us to do safe mathematical basic operations (sum, substract, multiply, and divide) checking for Overflow and Underflow of the results.

## Force sending Ether

The main contract contains a fallback function implemented to reject forcefully sending ether to the contract.
