# multipart-upload-to-s3

zip command:
zip --junk-paths --quiet --recurse-paths terraform/sdk-v3-test.zip functions/sdk-v3-test/*




/*

```
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({});

const streamToString = (stream) => new Promise((resolve, reject) => {
  const chunks = [];
  stream.on('data', (chunk) => chunks.push(chunk));
  stream.on('error', reject);
  stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
});

const readFile = async (bucket, key) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  const response = await client.send(command);

  const { Body } = response; 

  return streamToString(Body);
};

module.exports.index = async (event) => {
  const { BUCKET_NAME } = process.env;
  const { file } = event;

  return readFile(BUCKET_NAME, file);
};
```
*/


```
Running asycn function from console

const getHtml = async () => {
   await doSomeThingAsync();
}
(async() => {
  console.log('1')
  await getHtml()  
  console.log('2')
})()
```
