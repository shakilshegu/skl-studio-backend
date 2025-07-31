import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const S3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function deleteFile(file) {
  try {
    if (typeof file === 'string') {
      fs.unlinkSync(file);
      console.log(`File ${file} deleted!`);
    } else {
      fs.unlinkSync(file.path);
      console.log(`File ${file.filename} deleted!`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function uploadFile(file, cloudFilePath) {
  try {
    const fileBuffer =
      file instanceof Buffer ? file : await fs.promises.readFile(file.path);

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: cloudFilePath,
      Body: fileBuffer,
    });

    await S3.send(command);
    const fileUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${cloudFilePath}`;
    return fileUrl;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteS3File(path, completeUrl = true) {
  try {
    if (!path) {
      console.log('File path is undefined or empty.');
      return;
    }

    if (completeUrl) {
      const initial = getS3FileUrl('');
      path = path.slice(initial.length);
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: path,
    });

    await S3.send(command);
    console.log('File deleted successfully.');
  } catch (error) {
    console.log(error);
  }
}

function getS3FileUrl(path) {
  return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${path}`;
}

export { deleteFile, uploadFile, deleteS3File, getS3FileUrl };
