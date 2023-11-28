const { Upload } = require('@aws-sdk/lib-storage');

const multiPartUpload = async ({ folder, fileName, client, bucket, body }) => {
    const key = `${folder}/${fileName}`;
    try {
        const parallelUploads3 = new Upload({
            client,
            params: { Bucket: bucket, Key: key, Body: body },
            queueSize: 2, 
            partSize: 1024 * 1024 * 5, 
            leavePartsOnError: false,
        });
        parallelUploads3.on("httpUploadProgress", (progress) => {
            console.log(progress);
        });
        await parallelUploads3.done();
        return { status: 200, message: 'done'}
    } catch (e) {
        console.log(e);
        return { status: 500, message: 'error'}
    }
}
module.exports = {
    multiPartUpload,
}