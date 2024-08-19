import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import auth from './routers/auth.router'

const app = new Hono()

app.use('*', logger());

app.use('*', cors({ origin: '*' }));

app.route("/auth", auth)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

Bun.serve({
  port: process.env.PORT,
  fetch: app.fetch
})

export default app
