"use client";

import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { deleteInvitedUser } from "@/app/admin/(users-management)/actions";

export function DeleteInvitedUserButton({ email }: { email: string }) {
  const { execute } = useAction(deleteInvitedUser);

  return (
    <Button
      className="cursor-pointer"
      variant="destructive"
      size="sm"
      type="submit"
      onClick={() => execute({ email })}
    >
      Supprimer
    </Button>
  );
}
