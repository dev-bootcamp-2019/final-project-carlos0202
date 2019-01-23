# consensys-eth-dev-bc-final-project-poa
Consensys Academy Final Project - Carlos Antonio González Canario

About My Media Collection Dapp
My media collection is a proof of existence project based on the Ethereum blockchain, it is my final project for the Consensys academy Ethereum developer bootcamp.
Different sections of the application
Landing page:
•	Route path: /
•	Metamask: required
Description:
Landing page of the application. Section explaining the dapp, logged account, etc.
Upload page:
•	Route path: /upload-media
•	Metamask: required
Description
•	In this page you can upload your media content to the proof of existence dapp. It shows a form to register your content info and tags. Your media will be stored on IPFS thanks to the public Infura IPFS nodes.
•	Once you’ve filled the form and click the button to send your media, the metamask window should pop-up for a confirmation. Once the transaction is mined and it succeed, you will see a message of success and the hash corresponding to your proof.
Gallery Page:
•	Route path: /media-gallery
•	Metamask: required
Description
A page to display all the proof that are being stored in the dapp.
Search page:
•	Route path: /search-media
•	Metamask: required
Description
Page to search for a specific media proof. On the search bar you can paste a proof hash to look for a content.
Used tools

![ethereum](../assets/ethereum.png?raw=true "ethereum")
![metamask](https://github.com/carlos0202/consensys-eth-dev-bc-final-project-poa/tree/master/assets/metamask.png?raw=true "metamask")
![ipfs](https://github.com/carlos0202/consensys-eth-dev-bc-final-project-poa/tree/master/assets/ipfs.png?raw=true "ipfs")
![infura](https://github.com/carlos0202/consensys-eth-dev-bc-final-project-poa/tree/master/assets/infura.png?raw=true "infura")
![truffle](https://github.com/carlos0202/consensys-eth-dev-bc-final-project-poa/tree/master/assets/truffle.png?raw=true "truffle")
![react](https://github.com/carlos0202/consensys-eth-dev-bc-final-project-poa/tree/master/assets/react.png?raw=true "react")
![redux](https://github.com/carlos0202/consensys-eth-dev-bc-final-project-poa/tree/master/assets/redux.png?raw=true "redux")
![bootstrap](https://github.com/carlos0202/consensys-eth-dev-bc-final-project-poa/tree/master/assets/bootstrap.jpg?raw=true "bootstrap")

This Consensys final grade project has been possible thanks to the next tools and platforms:
Backend
•	Solidity and the Ethereum VM (EVM)
•	OpenZepellin battle-tested framework
•	IPFS and Infura public IPFS nodes
•	Truffle
Frontend
•	React JS
•	Redux
•	Web3.js 
•	Bootstrap
Testing
•	Truffle testing framework
•	Chai
•	Ganache CLI
How to get started
For local testing, you should be using console terminal to run commands, and have installed the minimum dependencies:
•	Git
•	Truffle
•	Ganache CLI
•	Chrome or Firefox browser
•	Metamask (Chrome extension, or Firefox Add-ons)
•	Python build tools available to resolve node-gyp Node.js native add-on build tool (More info for each platform following this link).
If you miss any tool, you can click on the tool name in the previous list and will point you to an installation guide for Ubuntu.
Now let’s get started. First open your command line and start Ganache CLI, without arguments, for fast mining and testing:
ganache-cli
Import the ganache-cli seed phrase into Metamask, to use the default generated addresses in ganache at the browser with Metamask. 
After opening ganache-cli and imported the seed into Metamask, you will run the next commands in a new command line window (or a new tab). Open it now and clone this Github repository into your machine with Git clone:
git clone https://github.com/carlos0202/consensys-eth-dev-bc-final-project-poa.git
Change directory (cd) to the recently cloned project:
cd consensys-eth-dev-bc-final-project-poa
Install the project dependencies:
npm install	
Compile the contracts, deploy and migrate using Truffle. The project is already pointing to ganache cli default port:
truffle compile
truffle migrate
Now the app is completely installed in your machine and deployed. Now you can test it or start in development mode and interact with it.
Run truffle tests:
truffle test

To run the development server you must change the current directory to the client directory:
cd client	

Then, you need to install all the frontend project dependencies using the following command:
npm install	

The last thing to do is start the development server using the next command:
npm run dev

After starting the application, you can point your browser to http://localhost:3000 and start interacting with it. Remember to keep open Ganache CLI and login in Metamask extension to be able to see the application in action.
