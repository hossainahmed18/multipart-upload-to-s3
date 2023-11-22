const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const getSignedUrlResponseForPutObject = async({ folder, fileName, client, bucket })=>{
    const expiresIn = 30000;
    const key = `${folder}/${fileName}`;
    const s3Params = {
        Bucket: bucket,
        Key: key
    };
    const command = new PutObjectCommand(s3Params);
    const url = await getSignedUrl(client, command, { expiresIn });
    return { status: 200, url }; 
}

module.exports = {
    getSignedUrlResponseForPutObject,
}