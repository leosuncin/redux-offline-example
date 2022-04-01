import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import jsonServer from 'json-server';

import timestampMiddleware from '../timestampMiddleware.cjs';

const server = jsonServer.create();
const middleware = jsonServer.defaults({
  bodyParser: true,
  static: 'build',
});

async function exist(file: string): Promise<boolean> {
  try {
    await fs.access(file);

    return true;
  } catch {
    return false;
  }
}

async function bootstrap() {
  const db = path.resolve(process.cwd(), 'db.json');
  const dest = path.join(os.tmpdir(), 'db.json');

  if (!(await exist(dest))) {
    fs.copyFile(db, dest);
  }

  const router = jsonServer.router(dest);

  server.use('/api', ...middleware, timestampMiddleware, router);
}

void bootstrap();

module.exports = server;
