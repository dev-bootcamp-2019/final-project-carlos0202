const path = require("path");
var HDWallet = require("truffle-hdwallet-provider");
const fs = require('fs');

const mnemonic = fs.readFileSync(".secret").toString().trim();
const infuraKey = "b78e6b63e2b547eb98af41a05bf7f4f6";

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*" // Match any network id
        },
        rinkeby: {
            provider: function () {
                return new HDWallet(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`);
            },
            network_id: 4,
            gas: 5500000,
            gasPrice: 10000000000,
        }
    },
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};
