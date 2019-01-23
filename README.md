# About My Media Collection Dapp

My media collection is a proof of existence project based on the Ethereum blockchain, it is my final project for the Consensys academy Ethereum developer bootcamp.

# Different sections of the application

## Landing page:
  *	**Route path**: */*
  * **Metamask**: *required*

### Description:

This is the landing page of the application and will serve as a startup point when the frontend app boots up. It contains some basic information regarding the DApp, and also shows some data relative to the logged user **(its address)**. It also contains a link to the upload media page.

## Upload page:
  *	**Route path:** */upload-media*
  *	**Metamask:** *required*

### Description

In this page you can upload your media content to the proof of existence DApp. It shows a form to register your content info and tags. Your media will be stored on IPFS thanks to the public Infura IPFS nodes. Once you’ve filled the form and click the button to send your media, the metamask window should pop-up for a confirmation. Once the transaction is mined and it succeed, you will see a message of success and the hash corresponding to your proof.

## Gallery Page:
  *	**Route path:** */media-gallery*
  *	**Metamask:** *required*

### Description

A page to display all the proof that are being stored in the DApp by the current user. The gallery it's set to display as much as 2 items per row on large screens, and only 1 item on small screens. Each item shows the title, tags, and the associated content of the image.

## Search page:
  *	**Route path:** */search-media*
  *	**Metamask:** *required*

### Description

This  is the page where users can search for a specific media proof using the **IPFS** hash given to the owner when he uploaded the content. On the search bar you can paste a proof hash to look for a content uploaded.


# Used tools

<img src="assets/ethereum.png?raw=true" alt="ethereum" width="64px" height="64px" /><img src="assets/ipfs.png?raw=true" alt="ipfs" width="64px" height="64px" /><img src="assets/metamask.png?raw=true" alt="metamask" width="64px" height="64px" /><img src="assets/truffle.png?raw=true" alt="truffle" width="64px" height="64px" /><img src="assets/infura.png?raw=true" alt="infura" width="64px" height="64px" /><img src="assets/react.png?raw=true" alt="react" width="64px" height="64px" /><img src="assets/redux.png?raw=true" alt="redux" width="64px" height="64px" /><img src="assets/bootstrap.jpg?raw=true" alt="bootstrap" width="64px" height="64px" />

This Consensys final grade project has been possible thanks to the next tools and platforms:

## Backend
  *	Solidity and the Ethereum VM (EVM)
  *	OpenZepellin battle-tested framework
  *	IPFS and Infura public IPFS nodes
  *	Truffle
  
## Frontend
  *	React JS
  *	Redux
  *	Web3.js 
  *	Bootstrap

## Testing
  *	Truffle testing framework
  *	Chai
  *	Ganache CLI
  

# How to get started

For local testing, you should be using console terminal to run commands, and have installed the minimum dependencies:
  *	Git
  *	Truffle
  *	Ganache CLI
  *	Chrome or Firefox browser
  *	Metamask (Chrome extension, or Firefox Add-ons)
  *	Python build tools available to resolve node-gyp Node.js native add-on build tool (More info for each platform following [this](https://www.npmjs.com/package/node-gyp) link).
  
If you miss any tool, you can click on the tool name in the previous list and will point you to an installation guide for Ubuntu.
Now let’s get started. First open your command line and start Ganache CLI, without arguments, for fast mining and testing:
```
ganache-cli
```

Import the ganache-cli seed phrase into Metamask, to use the default generated addresses in ganache at the browser with Metamask. After opening ganache-cli and imported the seed into Metamask, you will run the next commands in a new command line window (or a new tab). Open it now and clone this Github repository into your machine with Git clone:
```
git clone https://github.com/carlos0202/consensys-eth-dev-bc-final-project-poa.git
```

Change directory (cd) to the recently cloned project:
```
cd consensys-eth-dev-bc-final-project-poa
```

Install the project dependencies:
```
npm install	
```

Compile the contracts, deploy and migrate using Truffle. The project is already pointing to ganache cli default port, but remember to point to the right network using the **--network** flag because the config file points to the localhost and rinkeby networks (rinkeby link is my current testnet link):
```
truffle compile
truffle migrate
```

Now the DApp's contracts are completely installed in your machine and deployed. Now you can test them or setup the frontend development app and interact with it. To run the truffle tests of the deployed contracts you need to run the command:
```
truffle test
```

To run the development server you must first change the current directory to the client directory:
```
cd client	
```

Then, you need to install all the frontend project dependencies using the following command:
```
npm install	
```

The last thing to do is start the development server using the next command:
```
npm run dev
```

After starting the application, you can point your browser to http://localhost:3000 and start interacting with it. Remember to keep open Ganache CLI and login in Metamask extension to be able to see the application in action.
