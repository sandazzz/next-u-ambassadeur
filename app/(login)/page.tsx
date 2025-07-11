import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LoginButton from "./login-button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user.role === "admin") {
    redirect("/admin");
  } else if (session?.user.role === "ambassador") {
    redirect("/user/profile");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Subtle decorative elements */}
      <div className="absolute top-24 left-8 w-32 h-32 rounded-full bg-violet-100 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-24 right-8 w-40 h-40 rounded-full bg-fuchsia-100 opacity-40 blur-3xl"></div>

      {/* Main content - centered login card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <Card className="w-full max-w-sm mx-auto border border-slate-200 shadow-lg bg-white rounded-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
          <CardHeader className="text-center pt-8 pb-4">
            <CardTitle className="text-2xl font-semibold text-slate-800">
              Bienvenue à Next-U
            </CardTitle>
            <CardDescription className="text-slate-500 mt-1.5">
              Connectez-vous pour continuer
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <div className="w-full space-y-6">
              <LoginButton />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-4 text-slate-500">
                    Connexion sécurisée
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center text-center text-xs text-slate-500 px-8 pb-8 pt-2">
            <p>
              En vous connectant, vous acceptez nos{" "}
              <a
                href="#"
                className="text-violet-600 hover:text-fuchsia-600 transition-colors"
              >
                Conditions d&apos;utilisation
              </a>{" "}
              et{" "}
              <a
                href="#"
                className="text-violet-600 hover:text-fuchsia-600 transition-colors"
              >
                Politique de confidentialité
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>

      {/* Refined footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-slate-500">
          © 2025 Next-U. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
