import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('generateUploadUrl')

const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
const s3Client = new S3Client()

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    if (! await todoExists(todoId, userId)) {
      logger.error('Todo does not exist', { todoId })
      throw createError(
        404,
        JSON.stringify({
          error: "Todo with id " + todoId + "does not exist"
        })
      )
    }

    const url = await getUploadUrl(todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  })

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