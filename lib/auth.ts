import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const authOption: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email?.endsWith("next-u.fr")) {
        return true;
      }
      return false;
    },
  },
};

export const getAuthSession = async () => {
  const session = await getServerSession(authOption);
  return session;
};
