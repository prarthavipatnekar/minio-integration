const config = require('./config.js');
const Minio = require('minio');

const minioClient = new Minio.Client(config.minio);

exports.initializeBucket = async function(bucketName = 'default') {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (exists) {
            console.log('Bucket ' + bucketName + ' exists.');
        } else {
            await minioClient.makeBucket(bucketName, 'us-east-1')
            console.log('Bucket ' + bucketName + ' created in "us-east-1".');
        }
    } catch (err) {
        console.error('Error initializing bucket', err);
    }

}

exports.getPresignedUrl = async function(req, res) {
    try {
        const bucketName = req.query.bucket ?? 'default';
        const fileName = req.query.file ?? 'testFile.txt';
        const method = req.query.method ?? "PUT";
        const expiry = 24 * 60 * 60;

        const url = await minioClient.presignedUrl(method.toUpperCase(), bucketName, fileName, expiry);
        
        console.log('presigned url:', url);
        res.send(url);
    } catch (err) {
        console.error('Error getting presigned url', err);
        res.send(null);
    }

}

exports.uploadFile = async function(req, res) {

}

