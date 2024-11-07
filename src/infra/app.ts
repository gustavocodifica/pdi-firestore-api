import fastify from 'fastify'

import { errorHandler } from './error-handler'

export const app = fastify()

app.setErrorHandler(errorHandler)
