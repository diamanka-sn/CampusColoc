/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../utils/type';
import { authenticateUser } from '../utils/autorization';

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const headerAuth = req.headers['authorization'];
        const userId = authenticateUser(headerAuth);

        req.userId = userId;
        next();
  } catch (error:any) {
    const statusCode = error.message === "Utilisateur non authentifié" ? 401 : 500;
    res.status(statusCode).json({ error: true, message: error.message });
  }
};

export default authMiddleware;