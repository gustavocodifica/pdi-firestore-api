import fastify from 'fastify'

import { errorHandler } from './error-handler'
import { getUser } from './http/users/get-user-controller'
import { createUser } from './http/users/create-user-controller'
import { editUser } from './http/users/edit-user-controller'
import { deleteUser } from './http/users/delete-user-controller'
import { fetchUsers } from './http/users/fetch-users-controller'

export const app = fastify()

app.setErrorHandler(errorHandler)

app.register(getUser)
app.register(createUser)
app.register(editUser)
app.register(deleteUser)
app.register(fetchUsers)
