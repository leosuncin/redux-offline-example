/**
 * Add timestamp to the request body
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function timestampMiddleware(req, res, next) {
  if (req.method === 'POST') {
    const now = Date.now();

    req.body.createdAt = now;
    req.body.updatedAt = now;
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    req.body.updatedAt = Date.now();
  }

  next();
}

module.exports = timestampMiddleware;
