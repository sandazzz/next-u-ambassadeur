import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import prisma from "./prisma";
import { redirect } from "next/navigation";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? "ambassador",
        };
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user && user) {
        session.user.role = user.role;
      }
      session.user.image = user.image;
      return session;
    },
    async signIn({ account, profile }) {
      if (!profile?.email) {
        return false;
      }

      if (account?.provider === "google") {
        const allowed = await prisma.whitelistEmail.findUnique({
          where: { email: profile.email },
        });

        // if (allowed) {
        //   // Met à jour l'image dans la base à chaque connexion
        //   await prisma.user.update({
        //     where: { email: profile.email },
        //     data: {
        //       image: profile.picture,
        //     },
        //   });
        // }
        return !!allowed;
      }
      return false;
    },
  },
});

export async function checkAdminAccess() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  if (session.user.role !== "admin") {
    throw new Error("Accès non autorisé");
  }
}
