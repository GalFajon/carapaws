import express from 'express';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.get('/api/hello', (_request, response) => {
  response.json({ message: 'Hello from CaraPaws!' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`CaraPaws API listening on port ${port}`);
});
