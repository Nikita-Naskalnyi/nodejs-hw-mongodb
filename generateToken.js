import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { email: 'test3@example.com' },
  'VOQjLdrpG1TWCHhDzv3o', // Твой JWT_SECRET
  { expiresIn: '5m' }
);

console.log('TOKEN:', token);
