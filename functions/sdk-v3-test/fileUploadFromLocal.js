
const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client }  = require('@aws-sdk/client-s3');
const { multiPartUpload } = require('./multiPartUpload');
const fs = require('fs');

const handler = async () => {
    const region = 'eu-north-1';
    const bucket = `eu-north-1-dev-video-${org}-usp-output1`;
    const folder = '8cc1f1de-cb0c-4a6b-872b-8b543e5545c0';
    const client = new S3Client({ region });
    const localFilePath = "PGM1020195881801_T3MP4800_946305.mp4";
    const body = fs.readFileSync(localFilePath);
    const fileName = `junayed_${localFilePath}`;
    return multiPartUpload({ folder, fileName, client, bucket, body });
};

(async() => {
    const result = await handler();
    console.log(JSON.stringify(result, null, 2));
  })()