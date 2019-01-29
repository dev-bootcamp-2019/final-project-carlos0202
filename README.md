# About My Media Collection DApp

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

## My Gallery Page:
  *	**Route path:** */media-gallery*
  *	**Metamask:** *required*

### Description

A page to display all the proofs stored in the DApp by the current user. The gallery it's set to display as much as 2 items per row on large screens, and only 1 item on small screens. Each item shows the title, tags, and the associated content of the image. At the bottom of each items there is a section with buttons to allow deleting media and also show it as a single item in the search page.

## Search page:
  *	**Route path:** */search-media*
  *	**Metamask:** *required*

### Description

This  is the page where users can search for a specific media proof using the **IPFS** hash given to the owner when he uploaded the content. On the search bar you can paste a proof hash to look for a content uploaded.


# Used tools

<img src="assets/ethereum.png?raw=true" alt="ethereum" width="64px" height="64px" /><img src="assets/ipfs.png?raw=true" alt="ipfs" width="64px" height="64px" /><img src="assets/metamask.png?raw=true" alt="metamask" width="64px" height="64px" /><img src="assets/truffle.png?raw=true" alt="truffle" width="64px" height="64px" /><img src="assets/infura.png?raw=true" alt="infura" width="64px" height="64px" /><img src="assets/react.png?raw=true" alt="react" width="64px" height="64px" /><img src="assets/redux.png?raw=true" alt="redux" width="64px" height="64px" /><img src="assets/bootstrap.jpg?raw=true" alt="bootstrap" width="64px" height="64px" />

This Consensys final grade project has been possible thanks to the next tools and platforms:

## Backend
  *	[Solidity v0.5.0](https://solidity.readthedocs.io/en/v0.5.0/) and the Ethereum VM (EVM)
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
  * [Node.js and Npm](https://websiteforstudents.com/install-the-latest-node-js-and-nmp-packages-on-ubuntu-16-04-18-04-lts/)
  *	[Git](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-18-04)
  *	[Node-gyp Node.js native add-on build tool](https://www.npmjs.com/package/node-gyp) to install some Node.js packages
  *	[Truffle](https://truffleframework.com/docs/truffle/getting-started/installation)
  *	[Ganache CLI](https://github.com/trufflesuite/ganache-cli)
  *	[Chrome or Firefox browser](https://www.howtoforge.com/tutorial/ubuntu-latest-browsers-firefox-chromium-opera/)
  *	[Metamask (Chrome extension, or Firefox Add-ons)](https://metamask.io/)
  
  
If you miss any tool, you can click on the tool name in the previous list and will point you to an installation guide for Ubuntu.
Now let’s get started.

>__Note for Unix/Ubuntu users:__ `npm install` command could fail giving permission errors on folders. Usually it means that you need to run these commands using a **root** user prefixing the command with `sudo`. If running as root doesn't work you should try to fix your npm/node installation using [this](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) guide. After you can successfully install npm packages on your operative system you can proceed with the next steps detailed here. Note that you need to fix npm problems to install `truffle` and `ganache-cli` globally as well. As an alternative you could also install and configure yarn as the package manager of your choice. You can install yarn using the instructions provided [here](https://linuxize.com/post/how-to-install-yarn-on-ubuntu-18-04/). Some links in this guide are targeting Ubuntu 18.04 as the operative system. You could use any other operative system as long as you install all the necessary to build the contracts and run the frontend DApp.

First open your command line and start Ganache CLI, without arguments, for fast mining and testing:
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

Compile the contracts, deploy and migrate using Truffle. The project is configure to use **8545** as the default port under the *development* network configured on the `truffle-config.js` file, but remember to point to the right port as defined on your local `ganache-cli` running instance. After everything is properly configured you need to compile and migrate the contracts using the following commands:
```
truffle compile
truffle migrate
```

Now the DApp's contracts are completely installed in your machine and deployed. Now you can test them or setup the frontend development app and interact with it. To run the truffle tests of the deployed contracts you need to run the command:
```
truffle test
```

To run the development server you must first change the current directory to the client directory and install all the frontend npm package dependencies to be avaiable to run the react app and start interacting with the deployed contract using the following commands:
```
cd client	
npm install	
```

The last thing to do is start the development server using the next command:
```
npm run dev
```

If you encounter and error regarding `node-sass` like `ENOENT: no such file or directory, scandir '.../node_modules/node-sass/vendor'` it's because the `node-sass` package didn't build a configuration specific to your operative system or because you have installed packages as `root` on Linux. You can fix non permission issues with `node-sass` by running the following command:
```
npm rebuild node-sass
```

After starting the application, you can point your browser to http://localhost:3000 and start interacting with it. Remember to keep open Ganache CLI and login in Metamask extension to be able to see the application in action.

There is also a production deployed version of this DApp hosted on Heroku that anyone with a wallet and some ether in the rinkeby network can use visiting the following URL:

http://consensys-pf-poe-cagc.herokuapp.com/
