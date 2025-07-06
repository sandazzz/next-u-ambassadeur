"use client";

import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import { updateUserSlotStatus } from "@/app/admin/events-management/[eventId]/actions";
import { toast } from "sonner";

interface UserSlotActionsProps {
  userId: string;
  slotId: string;
  currentStatus: "confirmed" | "rejected" | "waiting_list";
}

export function UserSlotActions({
  userId,
  slotId,
  currentStatus,
}: UserSlotActionsProps) {
  const { execute, status } = useAction(updateUserSlotStatus, {
    onSuccess: () => {
      toast.success("Statut mis à jour avec succès");
    },
    onError: (error) => {
      toast.error("Erreur", {
        description: error.error.serverError || "Une erreur est survenue",
      });
    },
  });

  return (
    <div className="flex justify-end gap-2">
      <Button
        onClick={() =>
          execute({
            userId,
            slotId,
            status: "confirmed",
          })
        }
        variant="default"
        size="sm"
        disabled={currentStatus === "confirmed" || status === "executing"}
      >
        Confirmer
      </Button>
      <Button
        onClick={() =>
          execute({
            userId,
            slotId,
            status: "rejected",
          })
        }
        variant="destructive"
        size="sm"
        disabled={currentStatus === "rejected" || status === "executing"}
      >
        Refuser
      </Button>
    </div>
  );
}
