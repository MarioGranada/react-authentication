const { sign, verify } = require('jsonwebtoken');
const { compare } = require('bcryptjs');
const { NotAuthError } = require('./errors');

// Signing key from the environment (Vercel project env var, or the root
// .env.local locally). Fail closed: without it no token is issued or accepted.
function getKey() {
  const key = process.env.JWT_SECRET;
  if (!key) {
    throw new Error('JWT_SECRET is not set.');
  }
  return key;
}

function createJSONToken(email) {
  return sign({ email }, getKey(), { expiresIn: '1h' });
}

function validateJSONToken(token) {
  return verify(token, getKey(), { algorithms: ['HS256'] });
}

function isValidPassword(password, storedPassword) {
  return compare(password, storedPassword);
}

function checkAuthMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }
  if (!req.headers.authorization) {
    return next(new NotAuthError('Not authenticated.'));
  }
  const authFragments = req.headers.authorization.split(' ');

  if (authFragments.length !== 2) {
    return next(new NotAuthError('Not authenticated.'));
  }
  const authToken = authFragments[1];
  try {
    const validatedToken = validateJSONToken(authToken);
    req.token = validatedToken;
  } catch (error) {
    return next(new NotAuthError('Not authenticated.'));
  }
  next();
}

exports.createJSONToken = createJSONToken;
exports.validateJSONToken = validateJSONToken;
exports.isValidPassword = isValidPassword;
exports.checkAuth = checkAuthMiddleware;
