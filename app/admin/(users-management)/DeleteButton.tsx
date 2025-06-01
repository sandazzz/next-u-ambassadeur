"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteUser } from "@/lib/actions/user";
import { useTransition } from "react";
import { toast } from "sonner";

interface DeleteButtonProps {
  userId: string;
}

export function DeleteButton({ userId }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

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

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
      title="Supprimer"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
