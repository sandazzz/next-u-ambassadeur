import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UsersManagement } from "@/components/features/admin/users-management/users-management";
import { redirect } from "next/navigation";
import Link from "next/link";

import { InvitedUsersTable } from "../../../components/features/admin/users-management/invited-users-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

const CreateUserButton = () => {
  return (
    <Link href="/admin/create">
      <Button className="cursor-pointer">
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un utilisateur
      </Button>
    </Link>
  );
};
