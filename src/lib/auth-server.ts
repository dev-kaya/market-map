import { cookies } from 'next/headers';
import { Session } from './auth';

// Server-side session management
export function getServerSession(): Session | null {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return null;
    }

    return JSON.parse(sessionCookie.value) as Session;
  } catch {
    return null;
  }
}

export function isServerAuthenticated(): boolean {
  return !!getServerSession();
}