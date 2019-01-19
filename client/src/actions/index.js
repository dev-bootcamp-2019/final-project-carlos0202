import getWeb3 from '../utils/getWeb3';
import ipfs, { getFileUrl } from '../utils/getIPFS';
import * as T from './types';
import MediaManagerContract from "../contracts/MediaManager.json";
var contract = require("truffle-contract");

export const fetchWeb3 = () => {
    return async dispatch => {
        try {
            const web3 = await getWeb3();
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const mediaManager = contract(MediaManagerContract);
            mediaManager.setProvider(web3.currentProvider);
            const contractInstance = await mediaManager.deployed();
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

export const addMedia = (mediaInfo, contractInstance, account, web3, history) => {
    let attrHash;
    return async dispatch => {
        try {
            var mediaFileData = { ...mediaInfo };
            if (mediaInfo.isCameraPicture) {
                mediaFileData.mediaFile = await (blobToBuffer(dataURItoBlob(mediaInfo.mediaFromCamera)));
                mediaFileData.isVideo = false;
                delete mediaFileData.mediaFromCamera;
            } else {
                let file = mediaInfo.selectMedia.item(0);
                mediaFileData.mediaFile = await blobToBuffer(file);
                mediaFileData.isCameraPicture = false;
                mediaFileData.isVideo = isVideo(getExtension(file.name));
                delete mediaFileData.selectMedia;
            }

            let filesAdded = await ipfs.files
                .add(Buffer.from(mediaFileData.mediaFile));
            const file = filesAdded[0];
            mediaFileData.initHash = getFileUrl + file.hash;
            console.log(file.hash);
            const { mediaFile, ...dataToSave } = mediaFileData;
            const data = Buffer.from(JSON.stringify(dataToSave));

            let attributesHash = await ipfs.files.add(data);
            attrHash = attributesHash[0].hash;
            console.log(attrHash);

            let estimatedGas = await contractInstance
                .addOwnedMedia
                .estimateGas(
                    attrHash,
                    mediaFileData.isVideo,
                    mediaFileData.title,
                    mediaFileData.tags,
                    {
                        from: account
                    }
                );

            let receipt = await contractInstance.addOwnedMedia(
                attrHash,
                mediaFileData.isVideo,
                mediaFileData.title,
                mediaFileData.tags,
                {
                    from: account,
                    gas: estimatedGas + 100000
                }
            );
            let evt = receipt.logs[0].args;
            
            // test if media is added successfully
            let mediaData = await contractInstance.getMediaByMediaHash(evt.mediaHash, {from: account});
            console.log(mediaData);
            history.push('/');

            dispatch({
                type: T.PUSH_FILE,
                payload: { ...mediaInfo, ...evt, mediaAdded: true }
            });
        } catch (ex) {
            alert('Error ocurred while adding your file. Please check your info and try again later');
            console.log(ex);
            dispatch({
                type: T.PUSH_FILE,
                payload: { ...mediaInfo, mediaAdded: false }
            });
        }
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

async function blobToBuffer(blobFile) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();

        reader.onload = (event) => {
            var data = reader.result;

            resolve(data);
        };
        reader.readAsArrayBuffer(blobFile);
    });
}

function getExtension(filename) {
    var chunks = filename.split('.');

    return chunks[chunks.length - 1];
}

function isVideo(extension) {
    let allowedExtensions = new RegExp("(.*?)(.)?(mpg|mpeg|avi|mkv|3gp|mp4|wmv)$", "gi");

    return allowedExtensions.test(extension);
}