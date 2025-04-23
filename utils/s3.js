// const AWS = require('aws-sdk');
// const fs = require('fs');

// // Configure S3
// const s3 = new AWS.S3({ region: 'us-east-1' });
// const BUCKET_NAME = 'malware-detection-logs';

// exports.uploadToS3 = async (file) => {
//     const fileStream = fs.createReadStream(file.path);

//     const params = {
//         Bucket: BUCKET_NAME,
//         Key: file.filename,
//         Body: fileStream,
//     };

//     return await s3.upload(params).promise();
// };

const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3();

const uploadToS3 = async (file, key) => {
    const fileStream = fs.createReadStream(file.path);

    const params = {
        Bucket: 'malware-detection-logs', // Replace with your bucket name
        Key: key, // Use the provided key (e.g., 'uploads/fileName')
        Body: fileStream,
        ContentType: file.mimetype,
    };

    return s3.upload(params).promise();
};

module.exports = { uploadToS3 };
