import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todosAccess')

export class TodosAccess {
  constructor() {
    this.dynamoDbClient = AWSXRay.captureAWSv3Client(new DynamoDB())
    this.todosTable = process.env.TODOS_TABLE
    this.docClient = DynamoDBDocument.from(this.dynamoDbClient)
  }


  async getAllTodosOfUser(userId) {
    logger.info('Getting todos', { userId })
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


  async getTodo(userId, todoId) {
    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: { userId, todoId }
    })
    return result.Item
  }


  async createTodo(todo) {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    })
    return todo
  }

  async setAttachementOfTodo(userId, todoId) {
    const attachmentUrl = `https://${process.env.ATTACHMENTS_S3_BUCKET}.s3.amazonaws.com/${todoId}`
    await this.docClient.update({
      TableName: this.todosTable,
      Key: { todoId, userId },
      ConditionExpression: 'attribute_exists(userId) AND attribute_exists(todoId)',
      UpdateExpression: 'set attachmentUrl = :a',
      ExpressionAttributeValues: {
        ':a': attachmentUrl
      }
    })
    return attachmentUrl
  }


  async updateTodo(updateTodo) {

    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId: updateTodo.todoId,
        userId: updateTodo.userId
      },
      ConditionExpression: 'attribute_exists(userId) AND attribute_exists(todoId)',
      UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
      ExpressionAttributeNames: { '#n': 'name' },
      ExpressionAttributeValues: {
        ':n': updateTodo.name,
        ':due': updateTodo.dueDate,
        ':dn': updateTodo.done
      }
    })
    return updateTodo
  }


  async deleteTodo(userId, todoId) {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: { userId, todoId }
    })
  }
}
