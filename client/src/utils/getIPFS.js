const IPFS = require("ipfs-api");

// const currentConfig = process.env.REACT_APP_USE_LOCAL_IPFS && !process.env.REAC_APP_HEROKU ?
//     { host: 'localhost', port: '5001', readOnlyport: '8080', protocol: 'http' } :
//     { host: "ipfs.infura.io",  port: '5001', readOnlyport: '8080', protocol: "https" };
const currentConfig = { host: "ipfs.infura.io",  port: '5001', readOnlyport: '8080', protocol: "https" };

const ipfs = new IPFS(currentConfig);

export const getFileUrl = `https://ipfs.io/ipfs/`;

export default ipfs;