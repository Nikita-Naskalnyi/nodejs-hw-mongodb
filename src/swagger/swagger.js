import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const swaggerFile = path.resolve('docs', 'swagger.json');
const swaggerData = JSON.parse(fs.readFileSync(swaggerFile, 'utf-8'));

export const swaggerServe = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(swaggerData);
