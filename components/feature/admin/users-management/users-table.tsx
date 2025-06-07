"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRow } from "./user-row";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  credit: number | null;
  role: string;
}

function useFilteredUsers(users: User[], searchQuery: string) {
  return useMemo(() => {
    if (!searchQuery) return users;

    const query = searchQuery.toLowerCase();
    return users.filter((user) => {
      const name = user.name?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";
      return name.includes(query) || email.includes(query);
    });
  }, [users, searchQuery]);
}

export function UsersTable({ users }: { users: User[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = useFilteredUsers(users, searchQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crédits par utilisateur</CardTitle>
        <CardDescription>
          Gérez les crédits de tous les utilisateurs
        </CardDescription>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Crédits</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
