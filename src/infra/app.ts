import fastify from 'fastify'

import { errorHandler } from './error-handler'
import { getUser } from './http/get-user-controller'
import { createUser } from './http/create-user-controller'

export const app = fastify()

app.setErrorHandler(errorHandler)

app.register(getUser)
app.register(createUser)
