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

export default app;
