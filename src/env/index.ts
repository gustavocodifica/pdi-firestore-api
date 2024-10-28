import { z } from 'zod'

const envSchema = z.object({
  CLIENT_EMAIL: z.string().email(),
  PRIVATE_KEY: z.string(),
  PROJECT_ID: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
