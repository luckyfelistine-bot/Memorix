import CredentialsProvider from "next-auth/providers/credentials";
import { verifyAdminPassword } from "./auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password) return null;
        const isValid = await verifyAdminPassword(credentials.password);
        if (isValid) {
          return { id: "admin", name: "Admin", email: "admin@memorix.aevibron" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) token.role = "admin";
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token.role) session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
