"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { User } from "@prisma/client";
import { UsersTable } from "./users-table";

export function UsersManagement({ ambassadors }: { ambassadors: User[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des utilisateurs</CardTitle>
        <CardDescription>
          {ambassadors.length} utilisateur(s) au total
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
        <UsersTable users={ambassadors} />
      </CardContent>
    </Card>
  );
}
