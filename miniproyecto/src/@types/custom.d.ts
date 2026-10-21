declare namespace Express {
  interface Request {
    user?: {
      user_id?: string;
      userId?: string;
      username?: string;
      email?: string;
      rights?: string[];
    };
  }
}
