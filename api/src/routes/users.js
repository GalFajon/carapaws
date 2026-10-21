import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { rateLimit } from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import { prisma } from '../prisma.js';

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const allowedRoles = new Set(['owner', 'sitter']);
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Try again later.' },
});

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('JWT_SECRET must contain at least 32 bytes.');
  }

  return secret;
}

function isUniqueConstraintError(error) {
  return error?.code === 'P2002'
    || error?.code === '23505'
    || error?.cause?.code === '23505';
}

router.post('/register', authRateLimit, async (req, res) => {
  const { email, password, role, display_name: displayName } = req.body ?? {};

  if (
    typeof email !== 'string'
    || !emailPattern.test(email.trim())
    || typeof password !== 'string'
    || Buffer.byteLength(password, 'utf8') < 12
    || Buffer.byteLength(password, 'utf8') > 72
    || typeof displayName !== 'string'
    || displayName.trim().length < 1
    || displayName.trim().length > 100
    || typeof role !== 'string'
    || !allowedRoles.has(role)
  ) {
    return res.status(400).json({
      error: 'Provide a valid email, a password of 12-72 bytes, a display name of 1-100 characters, and a valid role.',
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await prisma.app_users.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.app_users.create({
      data: {
        email: normalizedEmail,
        password_hash: passwordHash,
        role,
        display_name: displayName.trim(),
      },
      select: {
        id: true,
        email: true,
        role: true,
        display_name: true,
        location: true,
      },
    });

    return res.status(201).json({ user });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    console.error('User registration failed:', error);
    return res.status(500).json({ error: 'Unable to register user.' });
  }
});

router.post('/login', authRateLimit, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || !emailPattern.test(email.trim()) || typeof password !== 'string') {
    return res.status(400).json({ error: 'A valid email and password are required.' });
  }

  try {
    const user = await prisma.app_users.findFirst({
      where: { email: { equals: email.trim(), mode: 'insensitive' } },
      select: {
        id: true,
        email: true,
        role: true,
        display_name: true,
        location: true,
        password_hash: true,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      {},
      getJwtSecret(),
      {
        algorithm: 'HS256',
        subject: user.id,
        expiresIn: '2h',
        issuer: 'carapaws-api',
        audience: 'carapaws-app',
      },
    );

    const { password_hash: _passwordHash, ...safeUser } = user;
    return res.json({ token, token_type: 'Bearer', expires_in: 7200, user: safeUser });
  } catch (error) {
    console.error('User login failed:', error);
    return res.status(500).json({ error: 'Unable to log in.' });
  }
});

router.post('/logout', authenticate, (_req, res) => {
  // Stateless JWT logout is completed by deleting the access token on the client.
  return res.json({ message: 'Logged out. Delete the access token on the client.' });
});

router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  if (!uuidPattern.test(id)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  if (req.user.id !== id) {
    return res.status(403).json({ error: 'You can only update your own profile.' });
  }

  const data = {};

  if (Object.hasOwn(req.body ?? {}, 'display_name')) {
    const { display_name: displayName } = req.body;

    if (typeof displayName !== 'string' || displayName.trim().length < 1 || displayName.trim().length > 100) {
      return res.status(400).json({ error: 'display_name must be between 1 and 100 characters.' });
    }

    data.display_name = displayName.trim();
  }

  if (Object.hasOwn(req.body ?? {}, 'location')) {
    const { location } = req.body;

    if (typeof location !== 'string' || location.trim().length > 200) {
      return res.status(400).json({ error: 'location must be a string of at most 200 characters.' });
    }

    data.location = location.trim();
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'Provide display_name or location to update.' });
  }

  try {
    const user = await prisma.app_users.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        display_name: true,
        location: true,
      },
    });

    return res.json({ user });
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'User not found.' });
    }

    console.error('User profile update failed:', error);
    return res.status(500).json({ error: 'Unable to update user.' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  if (!uuidPattern.test(id)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  if (req.user.id !== id) {
    return res.status(403).json({ error: 'You can only delete your own account.' });
  }

  try {
    await prisma.app_users.delete({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (error?.code === 'P2003' || error?.code === '23503' || error?.cause?.code === '23503') {
      return res.status(409).json({ error: 'Cannot delete this account while related records exist.' });
    }

    console.error('User deletion failed:', error);
    return res.status(500).json({ error: 'Unable to delete user.' });
  }
});

export default router;
