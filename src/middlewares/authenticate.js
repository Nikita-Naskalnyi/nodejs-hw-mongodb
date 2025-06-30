import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/user.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'Access token is missing or invalid');
    }

    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Access token expired'));
    } else {
      next(createHttpError(401, 'Invalid access token'));
    }
  }
};
  