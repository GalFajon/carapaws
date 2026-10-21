import jwt from 'jsonwebtoken';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function authenticate(req, res, next) {
  const authorization = req.get('authorization');
  const match = authorization?.match(/^Bearer ([^\s]+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    return next(new Error('JWT_SECRET must contain at least 32 bytes.'));
  }

  try {
    const payload = jwt.verify(match[1], secret, {
      algorithms: ['HS256'],
      audience: 'carapaws-app',
      issuer: 'carapaws-api',
    });

    if (typeof payload === 'string' || !UUID_PATTERN.test(payload.sub ?? '')) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    req.user = { id: payload.sub };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
