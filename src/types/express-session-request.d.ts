import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    session?: import('express-session').Session & import('express-session').SessionData;
  }
}