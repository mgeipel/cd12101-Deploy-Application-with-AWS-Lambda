import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'


const logger = createLogger('updateTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todo = JSON.parse(event.body)
    todo.todoId = event.pathParameters.todoId;
    todo.userId = getUserId(event)

    logger.info('Updating todo', {todo})

    const updatedTodo = await updateTodo(todo);

    return {
      statusCode: 201,
      body: JSON.stringify({updatedTodo})
    }
  })
