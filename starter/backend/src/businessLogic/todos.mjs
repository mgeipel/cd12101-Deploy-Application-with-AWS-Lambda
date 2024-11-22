import * as uuid from 'uuid'

import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const todosAccess = new TodosAccess()

export async function getAllTodosOfUser(userId) {
  return todosAccess.getAllTodosOfUser(userId)
}

export async function createTodo(todo, userId) {
  const todoId = uuid.v4()
  todo.todoId = todoId
  todo.userId = userId
  todo.done = false
  todo.createdAt = new Date().toISOString()
  return await todosAccess.createTodo(todo)
}

export async function updateTodo(todo) {
  return await todosAccess.updateTodo(todo)
}

export async function deleteTodo(userId, todoId) {
  await todosAccess.deleteTodo(userId, todoId)
}

export async function getTodo(todoId) {
  return await todosAccess.getTodo(todoId)
}

export async function todoExists(userId, todoId) {
    const todo = await todosAccess.getTodo(userId, todoId)
    if(!todo){
      return false
    }
    return todo.userId === userId
}

export async function setAttachementOfTodo(userId, todoId) {
  return await todosAccess.setAttachementOfTodo(userId, todoId)
}
