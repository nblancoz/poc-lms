import jwt from 'jsonwebtoken';
import { prisma } from '../models/prisma';
import { type AuthResponse, type JwtUserPayload } from '../types/auth';
import { comparePassword, hashPassword } from '../utils/password';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
}

const JWT_EXPIRES_IN = '7d';

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<
  { success: true; data: AuthResponse } | { success: false; reason: 'EMAIL_ALREADY_EXISTS' }
> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, reason: 'EMAIL_ALREADY_EXISTS' };
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const payload: JwtUserPayload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };

    const token = jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });

    return {
      success: true,
      data: {
        token,
        user: payload,
      },
    };
  } catch (error) {
    console.error('Error in registerUser service:', error);
    throw error;
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const payload: JwtUserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });

    return {
      token,
      user: payload,
    };
  } catch (error) {
    console.error('Error in loginUser service:', error);
    throw error;
  }
}

export function verifyToken(token: string): JwtUserPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as unknown as JwtUserPayload;
    if (!decoded || !decoded.id || !decoded.email) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}
