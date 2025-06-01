import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AddUserModal } from "./AddUserModal";

import { EditButton } from "./EditButton";
import { DeleteButton } from "./DeleteButton";
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
        <AddUserModal />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {users.length} utilisateur(s) au total
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date d&apos;inscription</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {getRoleBadge(user.role as "admin" | "ambassador")}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <EditButton user={user} />
                    <DeleteButton userId={user.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function getRoleBadge(role: "admin" | "ambassador") {
  const variants = {
    admin: "secondary",
    ambassador: "default",
  };
  return (
    <Badge variant={variants[role] as "secondary" | "default"}>{role}</Badge>
  );
}
