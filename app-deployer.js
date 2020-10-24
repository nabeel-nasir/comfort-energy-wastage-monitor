const request = require('request-promise');
const fs = require('fs-extra');
const argv = require('yargs').argv;

function transferFiles(uri, files) {
    const readStreamObjects = {};
    for (const formField in files) {
        const filePath = files[formField];
        readStreamObjects[formField] = fs.createReadStream(filePath);
    }

    const options = {
        method: 'POST',
        uri: uri,
        formData: readStreamObjects
    };

    return request(options);
}

function deployApp(gatewayIp, appPath, metadataPath) {
    const appFiles = {
        app: appPath,
        metadata: metadataPath
    };

    const httpFileTransferUri = `http://${gatewayIp}:5000/gateway/execute-app`;
    return transferFiles(httpFileTransferUri, appFiles);
};

const gatewayIp = argv.gatewayIp;
const appPath = argv.appPath;
const metadataPath = argv.metadataPath;

deployApp(gatewayIp, appPath, metadataPath);