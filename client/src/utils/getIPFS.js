const IPFS = require("ipfs-api");

const currentConfig = REACT_APP_USE_LOCAL_IPFS ?
    { host: 'localhost', port: '5001', protocol: 'http' } :
    { host: "ipfs.infura.io",  port: 5001, protocol: "https" };

const ipfs = new IPFS(currentConfig);

export default ipfs;
