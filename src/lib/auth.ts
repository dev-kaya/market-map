export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export interface Session {
  user: User;
  expires: string;
}

// Mock session management for demo purposes
// In production, this would integrate with NextAuth.js or similar
export function getSession(): Session | null {
  // For client-side, check sessionStorage/cookies
  if (typeof window !== 'undefined') {
    try {
      const session = document.cookie
        .split('; ')
        .find(row => row.startsWith('session='))
        ?.split('=')[1];
      
      if (!session) return null;
      return JSON.parse(decodeURIComponent(session)) as Session;
    } catch {
      return null;
    }
  }
  
  // For server-side, we'll handle this in the API route directly
  return null;
}

export function isAuthenticated(): boolean {
  return !!getSession();
}

// Mock sign-in function for demo
export function signIn(provider?: 'google' | 'magic-link') {
  // In production, this would redirect to NextAuth.js or your auth provider
  if (typeof window !== 'undefined') {
    const currentUrl = window.location.href;
    const signupUrl = `/signup?provider=${provider || 'google'}&callbackUrl=${encodeURIComponent(currentUrl)}`;
    window.location.href = signupUrl;
  }
}

export function signOut() {
  if (typeof window !== 'undefined') {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  }
}