import getWeb3 from '../utils/getWeb3';
import ipfs from '../utils/getIPFS';
import * as T from './types';
import MediaManagerContract from "../contracts/MediaManager.json";

export const fetchWeb3 = () => {
    return async dispatch => {
        try {
            const web3 = await getWeb3();
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = MediaManagerContract.networks[networkId];
            const contractInstance = new web3.eth.Contract(
                MediaManagerContract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            let result = {
                web3,
                accounts,
                contractInstance,
                account: accounts[0]
            };

            dispatch({ type: T.FETCH_WEB3, payload: result });
        } catch (e) {
            console.log(e);
            dispatch({
                type: T.FETCH_WEB3,
                payload: { web3: null, accounts: null, contractInstance: null, account: null }
            });
        }
    };
};

export const addMedia = (mediaInfo, history) => {
    console.log(mediaInfo);
    return async dispatch => {
        history.push('/');

        dispatch({
            type: T.PUSH_FILE,
            payload: { ...mediaInfo }
        });
    }
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab, 0, byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    return new Blob([ab], { type: mimeString });
}