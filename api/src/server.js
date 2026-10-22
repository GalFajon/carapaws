import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import usersRouter from './routes/users.js';

const app = express();
const port = Number(process.env.PORT) || 3000;
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || Buffer.byteLength(jwtSecret, 'utf8') < 32) {
  throw new Error('JWT_SECRET must be set to a random value of at least 32 bytes.');
}

const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    const error = new Error('Origin not allowed by CORS.');
    error.status = 403;
    return callback(error);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));
app.use(express.json({ limit: '16kb' }));
app.use('/users', usersRouter);

app.get('/api/hello', (_req, res) => res.json({ message: 'Hello from CaraPaws!' }));

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

app.use((error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status === 403
    ? 403
    : error.type === 'entity.too.large'
      ? 413
      : error.type === 'entity.parse.failed'
        ? 400
        : 500;

  console.error('Request failed:', error);
  return res.status(status).json({
    error: status === 400
      ? 'Invalid JSON request body.'
      : status === 413
        ? 'Request body is too large.'
        : status === 403
          ? 'Origin not allowed.'
          : 'Internal server error.',
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`CaraPaws API listening on port ${port}`);
});
