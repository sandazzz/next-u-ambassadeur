import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import { AmbassadorRanking } from "@/components/feature/admin/credits-management/ambassador-ranking";
import { UsersTable } from "@/components/feature/admin/users-management/users-table";

export default async function CreditsManagementPage() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    where: {
      role: "ambassador",
    },
    select: {
      id: true,
      name: true,
      email: true,
      credit: true,
      role: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des crédits
          </h1>
          <p className="text-muted-foreground">
            Gérez les points des ambassadeurs et consultez le classement
          </p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UsersTable users={users} />
        </div>
        <div>
          <AmbassadorRanking users={users} />
        </div>
      </div>
    </div>
  );
}
