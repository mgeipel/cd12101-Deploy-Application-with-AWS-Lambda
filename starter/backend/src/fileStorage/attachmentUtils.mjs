
import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('attachementUtils')

const s3Client = new S3Client()


const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)


export async function getUploadUrl(imageId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageId
  })

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  return url
}

export async function deleteAttachement(todoId) {
  try {

    logger.info('Deleting attchement of', { todoId })
    const command = new DeleteObjectCommand({
      Bucket: bucketName, 
      Key: todoId         
    })
    const response = await s3Client.send(command);

    return response;
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      logger.info('File does not exist, skipping delete.');
      return
    }
    logger.error('Error deleting file:', error);
    throw error; // Re-throw unexpected errors
  }
}