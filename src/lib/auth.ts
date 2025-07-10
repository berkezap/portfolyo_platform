import { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'read:user user:email public_repo'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 saat
    updateAge: 60 * 60, // 1 saat
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 saat
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true, // JavaScript'ten erişimi engelle
        sameSite: 'lax', // CSRF koruması için en iyi denge
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Sadece HTTPS'te gönder
        maxAge: 24 * 60 * 60, // 24 saat
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // İlk girişte: accessToken ve id'yi JWT'ye ekle
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      // Sonraki çağrılarda: token'ı olduğu gibi döndür (persist)
      return token;
    },
    async session({ session, token }) {
      // JWT'den session'a accessToken ve id'yi aktar
      if (token) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: any; baseUrl: any }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout'
  },
  // Güvenlik ayarları
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // CSRF koruması aktif
  useSecureCookies: process.env.NODE_ENV === 'production',
} 