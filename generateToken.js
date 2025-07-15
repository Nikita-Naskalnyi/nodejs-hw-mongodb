import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { email: 'test3@example.com' },
  'VOQjLdrpG1TWCHhDzv3o',
  { expiresIn: '5m' }
);

console.log('TOKEN:', token);
