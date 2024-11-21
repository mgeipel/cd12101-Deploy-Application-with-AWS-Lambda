import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { todoExists } from '../../businessLogic/todos.mjs'

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

    if(! await todoExists(todoId, userId)){
      logger.warn('Todo does not exist', {todoId})
      throw createError(
        404,
        JSON.stringify({
          error: "Todo with id " + todoId + "does not exist"
        })
      )
    }

    await deleteTodo(todoId)

    return {
      statusCode: 201,
      body: JSON.stringify({
      })
    }
  })

