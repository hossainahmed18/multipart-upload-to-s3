const { S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrlResponseForPutObject } = require('./getSignedUrlResponseForPutOperation');
const { multiPartUpload } = require('./multiPartUpload');

exports.handler = async (event) => {
    const region = 'eu-north-1';
    const bucket = 'eu-north-1-dev-video-test';
    const folder = 'junayed';
    const client = new S3Client({ region });
    const fileName = event.queryStringParameters?.fileName ?? "file -" + Date.now().toString();
    // return getSignedUrlResponseForPutObject({ folder, fileName, client, bucket });
    return multiPartUpload({ folder, fileName, client, bucket, body: event.body });
};