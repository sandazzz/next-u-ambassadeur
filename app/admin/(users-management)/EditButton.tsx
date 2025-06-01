"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { User } from "@prisma/client";
import { useState } from "react";
import { EditUserDialog } from "@/app/admin/(users-management)/EditUserDialog";

export function EditButton({ user }: { user: User }) {
  const [editingUser, setEditingUser] = useState<User | null>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setEditingUser(user)}
        title="Modifier"
      >
        <Edit className="h-4 w-4" />
      </Button>

      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      />
    </>
  );
}
