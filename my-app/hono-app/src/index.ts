/// <reference lib="dom" />
import { Hono, Context, Next } from 'hono'
import { cors } from 'hono/cors' // Import the CORS middleware

const app = new Hono()

// Add CORS middleware to allow requests from any origin
app.use('/*', cors())

// Basic auth middleware - for demonstration purposes only
function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization")
  if(!authHeader) {
    return c.text("Unauthorized", 401)
  }
  return next()
}

// Routes
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

let memes = [
  "One does not simply walk into Mordor.",
  "brace yourselves, winter is coming.",
  "what if i told you...",
  "i don't always...",
  "y u no...",
  "all your base are belong to us",
  "success kid",
  "disaster girl",
  "distracted boyfriend",
  "woman yelling at cat",
  "drake hotline bling",
  "expanding brain",
  "change my mind",
  "is this a pigeon?",
  "confused nick young",
  "mocking spongebob",
  "surprised pikachu",
  "this is fine",
  "doge",
  "grumpy cat",
  "bad luck brian",
  "first world problems",
  "philosoraptor",
  "ancient aliens",
  "arthur fist",
  "blinking white guy",
  "crying wojak",
  "epic handshake",
  "galaxy brain",
  "hide the pain harold",
  "i wish i had a button",
  "left exit 12 off ramp",
  "one does not simply",
  "pepe the frog",
  "salt bae",
  "side eye chloe",
  "spiderman pointing at spiderman",
  "the most interesting man in the world",
  "they're the same picture",
  "thinking emoji",
  "trade offer",
  "uno reverse card",
  "virgin vs chad",
  "we are venom",
  "woman in car",
  "x all the y",
  "you vs the guy she told you not to worry about",
  "zombie kid",
  "awkward seal",
  "boardroom meeting suggestion",
  "burning house",
  "car salesman",
  "chubby bubbles girl",
  "evil kermit",
  "finding nemo seagulls",
  "futurama fry",
  "good guy greg",
  "guy holding sign",
  "jackie chan confused",
  "joey tribbiani how you doin",
  "kombucha girl",
  "leo dicaprio cheers",
  "mahershala ali sweating",
  "matrix morpheus",
  "mr incredible becoming uncanny",
  "oprah you get a car",
  "paranoid parrot",
  "patrick star",
  "roll safe",
  "screaming wojak",
  "simpsons stepping into quarters",
  "squidward window",
  "success kid",
  "ten gallon hat spongebob",
  "the rock driving",
  "third world skeptical kid",
  "thomas the tank engine",
  "two buttons",
  "unsettled tom",
  "vince mcmahon reaction",
  "what would you do if",
  "woman yelling at cat",
  "yee",
  "you know i had to do it to em"
];

app.get("/memes",async(c) => {
 const RandomIdx=Math.floor(Math.random()*memes.length)
 const meme=memes[RandomIdx]
 return c.json({meme})
 })

 app.get("/random",async(c)=>{
  const num=Math.floor(Math.random()*100)+1;
  return c.json(num%2===0?"even":"odd")
 })

export default app
