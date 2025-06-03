import { TableCell } from "@/components/ui/table";

import { TableRow } from "@/components/ui/table";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import { User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

function UserRoleBadge({ role }: { role: "admin" | "ambassador" }) {
  const variants = {
    admin: "secondary",
    ambassador: "default",
  } as const;

  return <Badge variant={variants[role]}>{role}</Badge>;
}

export function UserRow({ user }: { user: User }) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {user.name ?? "Non renseigné"}
      </TableCell>
      <TableCell>{user.email ?? "Non renseigné"}</TableCell>
      <TableCell>
        <UserRoleBadge role={user.role as "admin" | "ambassador"} />
      </TableCell>
      <TableCell>
        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <EditButton user={user} />
          <DeleteButton userId={user.id} />
        </div>
      </TableCell>
    </TableRow>
  );
}
