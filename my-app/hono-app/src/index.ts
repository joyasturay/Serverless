/// <reference lib="dom" />
/// <reference types="@cloudflare/workers-types" />
import { Hono, Context, Next } from 'hono'
import { cors } from 'hono/cors'

// Add type definition for environment variables
type Bindings = {
  API_KEY: string
}

// Update Hono initialization with the Bindings type
const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

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

// New route for NASA APOD with caching and environment variable
app.get("/apod", async (c) => {
  const API_KEY = c.env.API_KEY

  if (!API_KEY) {
    return c.text("NASA API Key not configured.", 500);
  }

  const cacheKey = new Request(c.req.url, c.req); // Use the request URL as cache key
  const cache = caches.default; // Use the default cache

  // Check if the response is already in cache
  let response = await cache.match(cacheKey);

  if (!response) {
    // If not in cache, fetch from NASA API
    try {
      const apiResponse = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);

      if (!apiResponse.ok) {
        // Handle API errors
        return c.text(`Error fetching APOD from NASA: ${apiResponse.statusText}`, apiResponse.status);
      }

      const data = await apiResponse.json();

      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${data.title}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; background: #0b0c10; color: #f1f1f1; }
            img { max-width: 100%; height: auto; border-radius: 10px; }
            .container { max-width: 800px; margin: auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${data.title}</h1>
            <p><strong>Date:</strong> ${data.date}</p>
            ${data.media_type === 'image' ? `<img src="${data.url}" alt="NASA APOD" />` : `<p>Media type is not an image: ${data.media_type}</p>`}
            <p>${data.explanation}</p>
            ${data.copyright ? `<p>Copyright: ${data.copyright}</p>` : ''}
          </div>
        </body>
        </html>
      `;

      // Create a new Response object with the HTML
      response = new Response(html, {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });

      // Store the response in cache (need to clone as Response can only be consumed once)
      await cache.put(cacheKey, response.clone());

    } catch (error) {
      console.error("Error in APOD route:", error);
      return c.text("Internal Server Error fetching APOD", 500);
    }
  } else {
    console.log("Serving APOD from cache"); 
  }

  return response; 
});


export default app
