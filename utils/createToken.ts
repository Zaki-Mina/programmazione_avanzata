// utils/createToken.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function createToken(user: { id: number, email: string, role: string }) {
return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
);
}
