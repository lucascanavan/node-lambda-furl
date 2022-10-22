import app from './app';

export const handler = async (event, context) => {
  return await app.run(event, context);
};

// Local development mode.
if (process.env.NODE_ENV !== 'production') {
  import('./dev');
}
