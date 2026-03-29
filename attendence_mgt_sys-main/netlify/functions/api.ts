import serverless from 'serverless-http';
import app from '../../server/otp-server.js';

export const handler = serverless(app);
