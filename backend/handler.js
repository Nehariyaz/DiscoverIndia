// handler.js

const serverlessExpress = require('@vendia/serverless-express');
const app = require('./index');  // Import your Express app from index.js

exports.handler = serverlessExpress({ app });
