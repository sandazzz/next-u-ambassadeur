"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@prisma/client";
import { useState, useMemo } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { UsersTableHeader } from "./UsersTableHeader";
import { UserRow } from "./user-row";

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

export function UsersManagement({ users }: { users: User[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = useFilteredUsers(users, searchQuery);

  return (
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <UsersTableHeader />
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
