import { getAuthSession } from "@/lib/auth";
import { LoginButton } from "@/src/features/layout/auth/LoginButton";
import { LogoutButton } from "@/src/features/layout/auth/LogoutButton";

export default async function Home() {
  const session = await getAuthSession();
  console.log(session);

  if (session) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center">
        <pre> {JSON.stringify(session, null, 2)}</pre>
        <LogoutButton />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex justify-center items-center">
      <LoginButton />
    </div>
  );
}
