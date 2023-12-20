import { S3Client, CreateMultipartUploadCommand, CompleteMultipartUploadCommand, UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const chunkSize = 5*1024*1024;

export const handler = async (event) => {
    const region = 'eu-north-1';
    const bucket = 'eu-north-1-dev-video-test';
    const folder = 'junayed';
    const client = new S3Client({ region });
    const stage = event.queryStringParameters?.stage;
    const fileSizeInput = Number(event.queryStringParameters?.fileSizeInByte);
    console.log(JSON.stringify(event, null, 2))

    if(stage === 'initial'){
        const fileName = event.queryStringParameters?.fileName ?? "file -" + Date.now().toString();
        const key = `${folder}/${fileName}`;
        const command = new CreateMultipartUploadCommand({
            Bucket: bucket,
            Key:key,
        });
        const multipartUpload = await client.send(command);
        return {
            statusCode: 200,
            body: {
                uploadId: multipartUpload.UploadId,
                fileKey: multipartUpload.Key,
            }
        };

    }
    else if(stage === 'signedUrl' 
    && event.queryStringParameters?.uploadId 
    && event.queryStringParameters?.fileKey 
    && (!isNaN(fileSizeInput) && fileSizeInput > chunkSize)){
        const numberOfParts = Math.ceil(fileSizeInput / chunkSize);
        const expiresIn = 3600;
        const signedUrls = [];
        const multipartParams = {
            Bucket: bucket,
            Key: event.queryStringParameters.fileKey ,
            UploadId: event.queryStringParameters.uploadId,
        }
        for (let index = 0; index < numberOfParts; index++) {
            const PartNumber = index + 1;
            const command = new UploadPartCommand({
                ...multipartParams,
                PartNumber,
            });
            const signedUrl = await getSignedUrl(client, command, { expiresIn });
            signedUrls.push({
                signedUrl,
                PartNumber,
            });
        }
        return {
            statusCode: 200,
            body: signedUrls,
        };
    }
    else if(stage === 'complete' 
    && event.queryStringParameters?.uploadId 
    && event.queryStringParameters?.fileKey 
    && event.body.parts){
        /*
        doc
        https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/complete_multipart_upload.html
        part: {
            ETag,
            ChecksumCRC32,
            ChecksumCRC32C,
            ChecksumSHA1,
            ChecksumSHA256,
            PartNumber
        }
        */
        const multipartParams = {
            Bucket: bucket,
            Key: event.queryStringParameters.fileKey,
            MultipartUpload: {
				Parts: event.body.parts
			},
        }
        const command = new CompleteMultipartUploadCommand(multipartParams);
		await client.send(command);
        return {
			statusCode: 200,
			body:{
                completed: true
            }
		};
    }
};