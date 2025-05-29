// import NextAuth from "next-auth";
// import { authOption } from "@/lib/auth";

// const handler = NextAuth(authOption);

// export { handler as GET, handler as POST };

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
