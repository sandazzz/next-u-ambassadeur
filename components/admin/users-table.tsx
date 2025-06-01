import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { deleteUser } from "@/lib/actions/user";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { EditUserDialog } from "./edit-user-dialog";

export function UsersTable({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      const result = await deleteUser({ id: userId });
      if (!result) return;

      if ("error" in result) {
        toast.error(result.error as string);
      } else {
        toast.success("Utilisateur supprimé avec succès");
      }
    });
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "secondary",
      ambassador: "default",
    } as const;
    return (
      <Badge variant={variants[role as keyof typeof variants]}>{role}</Badge>
    );
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Date d&apos;inscription</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    key="edit"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingUser(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    key="delete"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
        />
      )}
    </>
  );
}
