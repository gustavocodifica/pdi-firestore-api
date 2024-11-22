import fastify from 'fastify'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

import { errorHandler } from './error-handler'
import { getUser } from './http/users/get-user-controller'
import { createUser } from './http/users/create-user-controller'
import { editUser } from './http/users/edit-user-controller'
import { deleteUser } from './http/users/delete-user-controller'
import { fetchUsers } from './http/users/fetch-users-controller'

export const app = fastify()

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'G Client API',
      description: 'G Client API',
      version: 'G Client API Documentation',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Insert the token in the format: Bearer <token>',
        },
      },
    },
  },
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.setErrorHandler(errorHandler)

app.register(getUser)
app.register(createUser)
app.register(editUser)
app.register(deleteUser)
app.register(fetchUsers)
