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
  return await todosAccess.createTodo(todo)
}

export async function updateTodo(todo) {
  return await todosAccess.updateTodo(todo)
}

export async function deleteTodo(todoId) {
  await todosAccess.deleteTodo(todoId)
}

export async function getTodo(todoId) {
  return await todosAccess.getTodo(todoId)
}

export async function todoExists(todoId, userId) {
    const todo = await todosAccess.getTodo(todoId)
    if(!todo){
      return false
    }
    return todo.userId === userId
}
