import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('createTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event)
    const todo = JSON.parse(event.body)
    logger.info('Creating todo', {todo})
    
    const newTodo = await createTodo(todo, userId)

    return {
      statusCode: 201,
      body: JSON.stringify({item: newTodo})
    }
  })

