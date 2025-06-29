import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DeleteInvitedUserButton } from "./delete-invited-user-button";

export function InvitedUsersTable({
  waitingUsers,
}: {
  waitingUsers: { email: string }[];
}) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Utilisateurs en attente de connexion
        </h2>
        <p className="text-muted-foreground">
          {waitingUsers.length} utilisateur(s) en attente de connexion
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {waitingUsers.map((user) => (
            <TableRow key={user.email}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <DeleteInvitedUserButton email={user.email} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
