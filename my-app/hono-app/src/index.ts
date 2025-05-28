/// <reference lib="dom" />
import { Hono, Context, Next } from 'hono'

const app = new Hono()

// auth middleware 
function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization")
  if(!authHeader) {
    return c.text("Unauthorized", 401)
  }
  return next()
}

app.get('/', authMiddleware, async (c) => {
  const authHeader = c.req.header("Authorization")
  const param = c.req.query("param")

  console.log(authHeader)
  console.log(param)

  return c.text('Hello Hono!')
})

app.post("/", authMiddleware, async(c) => {
  const body = await c.req.json()
  return c.json(body)
})

export default app
