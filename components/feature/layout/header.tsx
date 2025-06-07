import { ThemeToggle } from "@/components/feature/theme/theme-toggle";
import { UserProfile } from "@/components/feature/layout/auth/user-profile";

export const Header = async () => {
  return (
    <header className="border-b border-b-accent fixed top-0 z-20 left-0 right-0 bg-background">
      <div className="container flex items-center p-2 max-w-lg w-full m-auto gap-1">
        <h1 className="text-xl font-bold text-primary mr-auto">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-cyan-600">
            Next-U{" "}
          </span>
          Ambassador
        </h1>
        <UserProfile />
        <ThemeToggle />
      </div>
    </header>
  );
};
