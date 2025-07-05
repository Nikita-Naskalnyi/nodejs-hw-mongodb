import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import User from '../models/user.js';
import Session from '../models/session.js';
import mongoose from 'mongoose';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'Access token is missing or invalid');
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    const userId = new mongoose.Types.ObjectId(decoded.id);
    const user = await User.findById(userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    const session = await Session.findOne({
      userId: user._id,
      accessToken: token,
    });

    if (!session) {
      throw createHttpError(403, 'Session not found');
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
