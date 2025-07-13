import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import Session from '../models/session.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const { password: _, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const payload = { id: user._id };
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  const now = new Date();
  const accessExp = new Date(now.getTime() + 15 * 60 * 1000);
  const refreshExp = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await Session.findOneAndDelete({ userId: user._id });

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: accessExp,
    refreshTokenValidUntil: refreshExp,
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw createHttpError(401, 'Refresh token missing');
  }

  let payload;
  try {
    payload = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  const existingSession = await Session.findOne({
    refreshToken: oldRefreshToken,
  });
  if (!existingSession) {
    throw createHttpError(403, 'Session not found');
  }

  await Session.deleteOne({ _id: existingSession._id });

  const newPayload = { id: payload.id };
  const accessToken = jwt.sign(newPayload, JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(newPayload, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  const now = new Date();
  const accessExp = new Date(now.getTime() + 15 * 60 * 1000);
  const refreshExp = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: payload.id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: accessExp,
    refreshTokenValidUntil: refreshExp,
  });

  return { accessToken, refreshToken };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token missing');
  }

  const deleted = await Session.findOneAndDelete({ refreshToken });

  if (!deleted) {
    throw createHttpError(403, 'Session not found');
  }
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
