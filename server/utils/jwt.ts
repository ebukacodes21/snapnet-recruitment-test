import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

export const signToken = (payload: Object, options: SignOptions = {}) => {
    return jwt.sign(payload, process.env.SECRET!, options);
}

export const verifyToken = async <T>(token: string): Promise<T | null> => {
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET!) as T;
        return decodedToken;
    } catch (error) {
        return null;
    }
}