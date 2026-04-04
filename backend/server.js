import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import filesRouter from './routes/files.js'
import shareRouter from './routes/share.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'https://veilora.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.options('*', cors())

app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false
}))

app.use(express.json())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

app.use('/api/files', filesRouter)
app.use('/api/share', shareRouter)

app.get('/health', (_, res) => res.json({ ok: true }))

app.listen(process.env.PORT || 4000, () =>
  console.log(`Backend running on port ${process.env.PORT || 4000}`)
)