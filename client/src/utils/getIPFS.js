const IPFS = require("ipfs-api");

const currentConfig = process.env.REACT_APP_USE_LOCAL_IPFS ?
    { host: 'localhost', port: '5001', protocol: 'http' } :
    { host: "ipfs.infura.io",  port: 5001, protocol: "https" };

const ipfs = new IPFS(currentConfig);
console.log(currentConfig);

export const getFileUrl = `${currentConfig.protocol}://${currentConfig.host}:${currentConfig.port}/ipfs/`;

export default ipfs;