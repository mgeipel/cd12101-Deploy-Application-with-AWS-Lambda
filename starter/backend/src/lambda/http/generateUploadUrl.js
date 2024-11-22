import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { todoExists, setAttachementOfTodo } from '../../businessLogic/todos.mjs'
import { getUploadUrl } from '../../fileStorage/attachmentUtils.mjs'

const logger = createLogger('generateUploadUrl')


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

    if (! await todoExists(userId, todoId)) {
      logger.error('Todo does not exist', { todoId })
      throw createError(
        404,
        JSON.stringify({
          error: "Todo with id " + todoId + "does not exist"
        })
      )
    }

    const url = await getUploadUrl(todoId)
    setAttachementOfTodo(userId, todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({uploadUrl: url})
    }
  })

