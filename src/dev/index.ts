import http from 'http';
import app from '../app';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
  const questionIndex = req.url.indexOf('?');

  const path = questionIndex > 0 ? req.url.substr(0, questionIndex) : req.url;

  let queryString = '';
  const query = {};
  if (questionIndex > -1) {
    queryString = req.url.substr(questionIndex + 1);
    const searchParams = new URLSearchParams(queryString);
    for (const [key, value] of searchParams.entries()) {
      if (query[key]) {
        query[key] = [query[key], value].join(',');
      } else {
        query[key] = value;
      }
    }
  }

  const event = {
    version: '2.0',
    routeKey: '$default',
    rawPath: path,
    rawQueryString: queryString,
    queryStringParameters: query,
    headers: req.headers
  };

  const context = {};
  const result = await app.run(event, context)

  for (const header of Object.keys(result.headers)) {
    res.setHeader(header, result.headers[header]);
  }
  if (result.cookies) {
    for (const cookie of result.cookies) {
      res.setHeader('set-cookie', cookie);
    }
  }
  res.statusCode = result.statusCode;
  res.end(result.body);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
