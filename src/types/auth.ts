/**
 * Authentication related type definitions
 */

export interface SessionUser {
  email?: string;
  accessToken?: string;
  name?: string;
  image?: string;
  [key: string]: string | undefined;
}

export interface AuthSession {
  user?: SessionUser;
  expires: string;
}
