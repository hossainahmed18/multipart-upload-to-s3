/*
sample file to get file from s3

run: node functions/sdk-v3-test/getSampleJson.js

*/


const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const streamToString = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
  
  const readFile = async ({bucket, folder, client, fileName}) => {
    const key = `${folder}/${fileName}`;
    const params = {
      Bucket: bucket,
      Key: key,
    };
  
    const command = new GetObjectCommand(params);
    const response = await client.send(command);
  
    const { Body } = response; 
  
    return streamToString(Body);
  };
  
  const getFile = async (event) => {
    const region = 'eu-north-1';
    const bucket = '';
    const folder = '';
    const fileName = '';
    const client = new S3Client({ region });
    return readFile({bucket, fileName, folder, client});
  };
  
  (async() => {
    console.log('1')
    const result = await getFile();
    console.log(JSON.stringify(result, null, 2));  
    console.log('2')
  })()