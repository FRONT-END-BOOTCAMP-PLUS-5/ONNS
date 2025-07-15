import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/(backend)/user/domain/entities/JWTPayload';

export async function getUserFromJWT(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const secret = process.env.JWT_SECRET!;
  if (!secret) {
    throw new Error('JWT_SECRET is missing');
  }
  if (!token) return null;

  try {
    const data = jwt.verify(token, secret);
    if (
      typeof data === 'object' &&
      data !== null &&
      typeof data.id === 'number' &&
      typeof data.name === 'string'
    ) {
      return data as JWTPayload;
    }
    return null;
  } catch (err) {
    console.error('JWT verification failed: ', err);
    return null;
  }
}
