import lambdaApi from "lambda-api";

const app = lambdaApi({ logger: true });

app.get('*', async (req, res) => {
  return {
    method: req.method,
    path: req.path,
    query: req.query,
    multiValueQuery: req.multiValueQuery,
    headers: req.headers
  };
});

export const handler = async (event, context) => {
  return await app.run(event, context);
};

// Local development mode.
if (process.env.NODE_ENV !== 'production') {
  const http = require('http');

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

    // console.log(`url: ${req.url}, path: ${path}, queryString: ${queryString}, query: ${JSON.stringify(query)}, headers: ${JSON.stringify(req.headers)}`);

    const event = {
      version: '2.0',
      routeKey: '$default',
      rawPath: path,
      rawQueryString: queryString,
      queryStringParameters: query,
      headers: req.headers
    };

    const context = {};
    const result = await handler(event, context)

    res.statusCode = result.statusCode;
    res.headers = result.headers;
    res.end(result.body);
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}
