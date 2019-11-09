import AWS, { AWSError } from 'aws-sdk';
import { PutObjectOutput, GetObjectOutput } from 'aws-sdk/clients/s3';

const s3 = new AWS.S3();

const getFileNames = async (bucketName: string, limit?: number): Promise<string[]> => {
  if (!bucketName) {
    throw new Error('Error: attempted to get file names without specifying a bucket');
  }
  const s3Files = await s3
    .listObjectsV2({
      Bucket: bucketName,
      MaxKeys: limit ? limit : 1000
    })
    .promise();

  return s3Files.Contents
    ? s3Files.Contents.map((s3File): string => s3File.Key as string)
    : [];
};

const getFile = (bucket: string, fileName: string): Promise<GetObjectOutput> => {
  if (!bucket) {
    throw new Error('Error: attempted to get file without specifying a bucket');
  }

  return s3
    .getObject({
      Bucket: bucket,
      Key: fileName
    })
    .promise();
};

const uploadFile = (
  fileContent: string,
  bucket: string,
  fileName: string
): Promise<PutObjectOutput | AWSError> =>
  s3
    .putObject({
      Body: fileContent,
      Bucket: bucket,
      Key: fileName
    })
    .promise();

export { getFileNames, getFile, uploadFile };