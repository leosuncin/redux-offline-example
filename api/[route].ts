import jsonServer from 'json-server';

import timestampMiddleware from '../timestampMiddleware.cjs';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middleware = jsonServer.defaults({
  bodyParser: true,
  static: 'build',
});

server.use('/api', ...middleware, timestampMiddleware, router);

module.exports = server;
