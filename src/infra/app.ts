import fastify from 'fastify'

import { errorHandler } from './error-handler'
import { getUser } from './http/users/get-user-controller'
import { createUser } from './http/users/create-user-controller'
import { editUser } from './http/users/edit-user-controller'

export const app = fastify()

app.setErrorHandler(errorHandler)

app.register(getUser)
app.register(createUser)
app.register(editUser)
