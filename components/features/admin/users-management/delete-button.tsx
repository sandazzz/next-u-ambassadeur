"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteUserDialog } from "./delete-user-dialog";

interface DeleteButtonProps {
  userId: string;
}

export function DeleteButton({ userId }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        title="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <DeleteUserDialog
        userId={userId}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
