// handler.js
const serverlessExpress = require('@vendia/serverless-express');
const app = require('./index');
const connectDB = require('./config/db');

let server;

exports.handler = async (event, context) => {
  // Don't wait for open handles (like the DB connection) before returning
  context.callbackWaitsForEmptyEventLoop = false;

  // Make sure MongoDB is connected before handling the request.
  // Reuses the existing connection on warm invocations.
  await connectDB();

  server = server || serverlessExpress({ app });
  return server(event, context);
};