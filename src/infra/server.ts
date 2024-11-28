import { env } from '../infra/env'
import { app } from './app'

app.listen({ port: env.PORT }).then(() => console.log('http server running'))
