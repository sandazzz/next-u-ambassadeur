"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
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
              Welcome
            </CardTitle>
            <CardDescription className="text-slate-500 mt-1.5">
              Sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <div className="w-full space-y-6">
              <Button
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center gap-3 py-5 text-sm font-medium transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-md"
                variant="outline"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Se connecter avec Google</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-4 text-slate-500">
                    Secure connection
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center text-center text-xs text-slate-500 px-8 pb-8 pt-2">
            <p>
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="text-violet-600 hover:text-fuchsia-600 transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-violet-600 hover:text-fuchsia-600 transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </CardFooter>
        </Card>
      </main>

      {/* Refined footer */}
      <footer className="p-6 text-center">
        <p className="text-xs text-slate-500">
          © 2025 AppName. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
