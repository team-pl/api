import { config } from 'dotenv';

config();

export const cookieOption = {
  secure: process.env.NODE_ENV === 'development' ? false : true,
  domain:
    process.env.NODE_ENV === 'development' ? 'localhost' : 'teampl-plus.com',
  maxAge: 7 * 24 * 60 * 60 * 1000, //7d,
  path: '/',

  // httpOnly: false,
  // signed: true,
};
