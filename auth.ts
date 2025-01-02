import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/drizzle";
import { getUserById } from "./lib/actions/auth/signUp.action";
import { users } from "./db/schemas";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, `${user.id}`));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log({ user, account });
      if (account?.provider !== "credentials") return true;
      if (!account || !user) return false;

      const existingUser = await getUserById(user.id as string);
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }
      console.log(existingUser);

      return true;
    },

    async session({ session, token, user }) {
      // Set UserId in session
      if (token.sub && session.user) {
        session.user.id = token.sub as string;
      }

      // TODO: Set role in user session

      return session;
    },

    async jwt({ token, account }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.AUTH_SECRET,
  // debug: true,
});
