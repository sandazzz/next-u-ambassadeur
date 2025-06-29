import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateUserButton } from "@/components/features/admin/users-management/create-user-button";
import { UsersManagement } from "@/components/features/admin/users-management/users-management";
import { redirect } from "next/navigation";

import { InvitedUsersTable } from "./invited-users-table";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const users = await prisma.user.findMany();

  const waitingUsers = await prisma.whitelistEmail.findMany({
    where: {
      email: {
        notIn: users
          .map((user) => user.email)
          .filter((email): email is string => email !== null),
      },
    },
  });

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
      <InvitedUsersTable waitingUsers={waitingUsers} />
    </div>
  );
}
