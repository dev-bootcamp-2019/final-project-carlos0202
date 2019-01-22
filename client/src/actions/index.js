import getWeb3 from '../utils/getWeb3';
import ipfs from '../utils/getIPFS';
import * as T from './types';
import MediaManagerContract from "../contracts/MediaManager.json";
import {
    pendingTask, // The action key for modifying loading state
    begin, // The action value if a "long" running task begun
    end, // The action value if a "long" running task ended
} from 'react-redux-spinner';
var contract = require("truffle-contract");

export const fetchWeb3 = () => {
    return async dispatch => {
        try {
            dispatch({
                type: T.LOADING,
                [pendingTask]: begin
            });
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

            dispatch({
                type: T.FETCH_WEB3,
                [pendingTask]: end,
                payload: result
            });
        } catch (e) {
            console.log(e);
            dispatch({
                type: T.FETCH_WEB3,
                [pendingTask]: end,
                payload: { web3: null, accounts: null, contractInstance: null, account: null }
            });
        }
    };
};

export const addMedia = (mediaInfo, contractInstance, account, web3, history) => {
    let attrHash;
    return async dispatch => {
        try {
            dispatch({
                type: T.LOADING,
                [pendingTask]: begin
            });
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
                .add(Buffer.from(mediaFileData.mediaFile), { onlyHash: true });
            const calculatedHash = filesAdded[0].hash;

            let fileExists = await contractInstance.checkIfExists(calculatedHash, { from: account });

            if (fileExists) {
                let error = "The file you are atempting to add already exists, please add a different one.";
                throw (error);
            }

            let attributesHash = await ipfs.files.add(Buffer.from(mediaFileData.mediaFile));
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
            console.log(evt);
            history.push('/');

            window.Swal.fire(
                'Successful interaction!',
                `Media File added successfully!!. Here's your proof to retrieve it latter! <br /> <p>${attrHash}</p>`,
                'success'
            );

            dispatch({
                type: T.PUSH_FILE,
                [pendingTask]: end,
                payload: { attrHash, ...evt, mediaAdded: true }
            });
        } catch (ex) {
            console.log(ex);
            window.Swal.fire(
                "Error processing your request!",
                'Error ocurred while adding your file. Please check your info and try again later',
                'error'
            );
            console.log(ex);
            dispatch({
                type: T.PUSH_FILE,
                [pendingTask]: end,
                payload: { mediaAdded: false }
            });
        }
    }
}

export const getFilesCount = (web3, contractInstance, account) => {
    return async dispatch => {
        dispatch({
            type: T.LOADING,
            [pendingTask]: begin
        });

        let { totalAddedFiles, currentFilesCount } = await contractInstance.getUserMediaIndex({ from: account });

        dispatch({
            type: T.GET_FILES_COUNT,
            [pendingTask]: end,
            payload: { totalAddedFiles, currentFilesCount }
        });
    };
}

export const getOwnedMedia = (contractInstance, account, recordsCount) => {
    return async dispatch => {
        dispatch({
            type: T.LOADING,
            [pendingTask]: begin
        });

        let payload = await getMedia(contractInstance, account, recordsCount);
        // console.log(userMedia, from, recordsCount);
        dispatch({
            type: T.GET_USER_MEDIA,
            [pendingTask]: end,
            payload: payload
        });
    };
}

export const deleteOwnedMedia = (contractInstance, account, mediaHash, recordsCount, caller) => {
    return async dispatch => {
        dispatch({
            type: T.LOADING,
            [pendingTask]: begin
        });
        console.log(caller);
        try {
            let estimatedGas = await contractInstance.deleteOwnedMedia
                .estimateGas(mediaHash, { from: account });
            let receipt = await contractInstance
                .deleteOwnedMedia(mediaHash, { from: account, gas: estimatedGas + 100000 });
            let evt = receipt.logs[0].args;
            console.log([receipt, evt]);
            let { totalAddedFiles } = await contractInstance.getUserMediaIndex({ from: account });

            if (receipt.logs[0].event === "MediaDeleted") {
                window.Swal.fire(
                    'Successful interaction!',
                    `Media File deleted successfully!!!`,
                    'success'
                );
            } else {
                window.Swal.fire(
                    'Wrong interaction!',
                    `Media File deletion was not successful. Please check your data and try again later!!!`,
                    'warning'
                );
            }

            if (caller === "SEARCH") {
                dispatch({
                    type: T.FETCH_MEDIA,
                    [pendingTask]: end,
                    payload: null
                });

                return;
            }

            let payload = await getMedia(contractInstance, account, totalAddedFiles);

            dispatch({
                type: T.GET_USER_MEDIA,
                [pendingTask]: end,
                payload: payload
            });
        } catch (ex) {
            console.log(ex);
            window.Swal.fire(
                "Error processing your request!",
                'Error ocurred while deleting your file. Please check your info and try again later',
                'error'
            );

            return getOwnedMedia(contractInstance, account, recordsCount);
        }

    };
}

export const getMediaByHash = (hash, contractInstance, account) => {
    return async dispatch => {
        dispatch({
            type: T.LOADING,
            [pendingTask]: begin
        });
        try {

            if (hash == null) {
                dispatch({
                    type: T.FETCH_MEDIA,
                    [pendingTask]: end,
                    payload: null
                });

                return;
            }

            const { title, tags, isVideo, mediaHash, mediaOwner, timestamp } =
                await contractInstance.getMediaByMediaHash(hash, { from: account });

            dispatch({
                type: T.FETCH_MEDIA,
                [pendingTask]: end,
                payload: { title, tags, isVideo, mediaHash, mediaOwner, timestamp }
            });
        } catch (ex) {
            console.log(ex);
            window.Swal.fire(
                "Error processing your request!",
                'Error ocurred while obtaining requested file. Please check your info and try again later',
                'error'
            );

            dispatch({
                type: T.FETCH_MEDIA,
                [pendingTask]: end,
                payload: null
            });
        }
    };
};

// Helper funcitons. Should be moved to it's own file and just reference them 
// from somewhere else. Because all the data handling happens in this file I 
// decided to keep them here for now. :)

async function getMedia(contractInstance, account, recordsCount) {
    let userMedia = [];
    let failedAtempts = 0;
    let from = 1;
    while (from <= recordsCount) {
        try {
            // console.log(from, recordsCount);
            const { title, tags, isVideo, mediaHash, mediaOwner, timestamp } =
                await contractInstance.getUserMedia(from, { from: account });
            userMedia.push({ index: from, title, tags, isVideo, mediaHash, mediaOwner, timestamp: timestamp.toNumber() });

        } catch (ex) {
            console.log(`Failed to retrieve media at user's index ${from}.`);
            failedAtempts++;
        }
        from++;
    }

    return { userMedia, failedAtempts, mediaFetched: true };
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
    let allowedExtensions = new RegExp("(.*?)(.)?(mpeg|avi|mkv|3gp|mp4|wmv)$", "gi");

    return allowedExtensions.test(extension);
}