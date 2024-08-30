
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
import https from 'https';

const s3Client = new S3Client({ region: 'eu-north-1' });

export const handler = async () => {
  const url = 'https://files.testfile.org/Video MP4/Sand - testfile.org.mp4';
  const s3Bucket = 'eu-north-1-dev-video-test';
  const s3Key = 'junayed/test-files/videos/sand.mp4';
  const partSize = 5 * 1024 * 1024;

  let uploadId;
  try {
    const createMultipartUploadParams = {
      Bucket: s3Bucket,
      Key: s3Key,
    };
    const createResponse = await s3Client.send(new CreateMultipartUploadCommand(createMultipartUploadParams));
    uploadId = createResponse.UploadId;
    console.log(`Multipart upload initiated. Upload ID: ${uploadId}`);
  } catch (err) {
    console.error("Error initiating multipart upload", err);
    throw new Error("Failed to initiate multipart upload");
  }

  let partNumber = 1;
  let uploadedParts = [];

  try {
    await downloadAndUploadParts(url, s3Bucket, s3Key, uploadId, partNumber, uploadedParts, partSize);
  } catch (err) {
    console.error("Error during multipart upload", err);

    await s3Client.send(new AbortMultipartUploadCommand({
      Bucket: s3Bucket,
      Key: s3Key,
      UploadId: uploadId,
    }));
    throw new Error("Multipart upload aborted due to an error");
  }

  try {
    const completeMultipartUploadParams = {
      Bucket: s3Bucket,
      Key: s3Key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: uploadedParts,
      },
    };
    const completeResponse = await s3Client.send(new CompleteMultipartUploadCommand(completeMultipartUploadParams));
    console.log("Multipart upload completed", completeResponse);
    return `s3://${s3Bucket}/${s3Key}`;
  } catch (err) {
    console.error("Error completing multipart upload", err);
    throw new Error("Failed to complete multipart upload");
  }
};

const downloadAndUploadParts = (url, bucket, key, uploadId, partNumber, uploadedParts, partSize) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(`Failed to get '${url}' (${response.statusCode})`);
      }

      let buffer = [];
      let bufferSize = 0;

      response.on('data', async (chunk) => {
        buffer.push(chunk);
        bufferSize += chunk.length;

        console.log('...............0...........');
        console.log(buffer);
        console.log(buffer.length);
        console.log('...............0...........');

        if (bufferSize >= partSize) {
          response.pause(); 
          

          const partBuffer = Buffer.concat(buffer);
          console.log('...............1...........');
          console.log(buffer);
          console.log(buffer.length);
          console.log(partBuffer)
          console.log(partBuffer.length)
          console.log('...............1...........');
          await uploadPartToS3(partBuffer.slice(0, partSize), bucket, key, uploadId, partNumber++, uploadedParts);

          buffer = [partBuffer.slice(partSize)];

          console.log('...............2...........');
          console.log(buffer);
          console.log(buffer.length);
          console.log('...............2...........');
          bufferSize = buffer[0].length;

          response.resume(); 
        }
      });

      response.on('end', async () => {
        if (bufferSize > 0) {
          await uploadPartToS3(Buffer.concat(buffer), bucket, key, uploadId, partNumber++, uploadedParts);
        }
        resolve();
      });

      response.on('error', (err) => {
        reject(err);
      });
    });
  });
};

const uploadPartToS3 = async (partBuffer, bucket, key, uploadId, partNumber, uploadedParts) => {
  const uploadPartParams = {
    Bucket: bucket,
    Key: key,
    PartNumber: partNumber,
    UploadId: uploadId,
    Body: partBuffer,
  };

  try {
    const uploadPartResponse = await s3Client.send(new UploadPartCommand(uploadPartParams));
    uploadedParts.push({
      ETag: uploadPartResponse.ETag,
      PartNumber: partNumber,
    });
    console.log(`Uploaded part ${partNumber} with ETag ${uploadPartResponse.ETag}`);
  } catch (err) {
    console.error(`Error uploading part ${partNumber}`, err);
    throw new Error(`Failed to upload part ${partNumber}`);
  }
};


(async() => {
    console.log('Uploading video to S3...');
    const result = await handler();
    console.log('Video uploaded to:', result);
    console.log(JSON.stringify(result, null, 2));
  })()
