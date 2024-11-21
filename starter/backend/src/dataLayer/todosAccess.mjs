import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todosAccess')

export class TodosAccess {
  constructor() {
    this.dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDB())
    this.todosTable = process.env.TODOS_TABLE
    this.docClient =  DynamoDBDocument.from(this.dynamoDbClient)
  }


  async getAllTodosOfUser(userId) {
    logger.info('Getting todos', {userId})
    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    })
    return result.Items
  }


  async getTodo(todoId) {
    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: {todoId}
    })
    return result.Item
  }


  async createTodo(todo) {
    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })
    return todo
  }


  async updateTodo(todoId, updateTodoRequest) {

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
         todoId: todoId
      },
      UpdateExpression: 'set #namefield = :n, duDate = :d, done = :done',
      ExpressionAttributeValues: {
          ':n': updateTodoRequest.name,
          'd:': updateTodoRequest.dueDate,
          'done': updateTodoRequest.done
      },
      ExpressionAttributeNames: {
        "#namefield": "name"
      }
    })
    return updateTodoRequest
  }


  async deleteTodo(todoId) {
    await this.docClient.delete({
      TableName: this.todosTable,
      Item: {todoId}
    })
  }
}
