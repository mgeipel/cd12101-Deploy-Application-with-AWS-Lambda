import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { todoExists } from '../../businessLogic/todos.mjs'

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
    const todo = JSON.parse(event.body)
    const todoId = event.pathParameters.todoId
    logger.info('Updating todo', {todo})
    
    if(! await todoExists(todoId, userId)){
      logger.warn('Todo does not exist', {todoId})
      throw createError(
        404,
        JSON.stringify({
          error: "Todo with id " + todoId + "does not exist"
        })
      )
    }

    todo.todoId = todoId;

    const updatedTodo = updateTodo(todo);

    return {
      statusCode: 201,
      body: JSON.stringify({
        updatedTodo
      })
    }
  })
