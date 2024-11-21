import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const s3Client = new S3Client()


const todosTable = process.env.TODOTS_TABLE
const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)


async function getUploadUrl(imageId) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: imageId
    })
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: urlExpiration
    })
    return url
  }