import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateUserButton } from "./CreateUserButton";
import { UsersManagement } from "./UsersManagement";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }
  const users = await prisma.user.findMany();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs ayant accès à l&apos;application
          </p>
        </div>
        <CreateUserButton />
      </div>
      <UsersManagement users={users} />
    </div>
  );
}
