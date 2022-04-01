import jsonServer from 'json-server';

import timestampMiddleware from '../timestampMiddleware.cjs';
import db from '../db.json';

const server = jsonServer.create();
const router = jsonServer.router(db);
const middleware = jsonServer.defaults({
  bodyParser: true,
  static: 'build',
});

server.use('/api', ...middleware, timestampMiddleware, router);

module.exports = server;
