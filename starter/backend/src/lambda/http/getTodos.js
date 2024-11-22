import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { getAllTodosOfUser } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('getTodos')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event)
    logger.info('Getting todos', {userId})
    
    const todos = await getAllTodosOfUser(userId)

    return {
      statusCode: 201,
      body: JSON.stringify({items: todos})
    }
  })


