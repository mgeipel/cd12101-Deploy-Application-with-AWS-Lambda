import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { deleteAttachement } from '../../fileStorage/attachmentUtils.mjs'


const logger = createLogger('deleteTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    logger.info('Deleting todo', {todoId})

    await deleteTodo(userId, todoId)
    deleteAttachement(todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({})
    }
  })

