import express from 'express';
import serverless from 'serverless-http';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ hello: 'world!' });
});

app.listen(port, () => {
  console.log('listening on port ' + port);
});

export const handler = serverless(app);
