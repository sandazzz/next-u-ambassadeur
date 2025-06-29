import { TableHead, TableRow, TableHeader } from "@/components/ui/table";

export function UsersTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Nom</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Rôle</TableHead>
        <TableHead>Date de création</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
