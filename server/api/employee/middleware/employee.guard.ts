import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../../../utils/jwt';

export async function isAdmin(req: Request, res: Response, next: NextFunction){
  try {
    const authorizationHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authorizationHeader || typeof authorizationHeader !== 'string') {
      return res.status(401).json({ message: 'authorization header is missing or invalid', statusCode: 401 });
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'bearer token is missing or invalid authorization format', statusCode: 401 });
    }

    const payload = await verifyToken<{ email: string, id: string, role: string }>(token);
    if (!payload) {
      return res.status(401).json({ message: 'invalid or expired token', statusCode: 401 });
    }

    if(payload.role === "employee"){
      return res.status(403).json({ message: 'forbidden to perform request', statusCode: 403 });
    }

    res.locals = payload
    next()
  } catch (error) {
    return res.status(500).json({ message: 'internal server error', statusCode: 500 });
  }
}