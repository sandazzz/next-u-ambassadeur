"use client";

import { Event } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { deleteEvent, updateEventStatus } from "./events-management.action";
import { toast } from "sonner";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useAction } from "next-safe-action/hooks";
import CircularLoader from "@/components/ui/circular-loader";
import { Trash2 } from "lucide-react";

type EventStatus = "open" | "closed" | "completed";

export function EventActions({ event }: { event: Event }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const { executeAsync: executeDelete } = useAction(deleteEvent, {
    onSuccess: () => {
      setIsDeleting(false);
      toast.success("Événement supprimé avec succès");
    },
    onError: () => {
      setIsDeleting(false);
      toast.error("Erreur lors de la suppression de l'événement");
    },
  });

  const { executeAsync: executeStatusUpdate } = useAction(updateEventStatus, {
    onSuccess: () => {
      toast.success("Statut mis à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut");
    },
  });

  const handleDeleteEvent = async () => {
    setIsDeleting(true);
    await executeDelete({ id: event.id });
  };

  const handleStatusChange = async (newStatus: EventStatus) => {
    await executeStatusUpdate({
      id: event.id,
      status: newStatus,
    });
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Switch
          checked={event.status === "open"}
          onCheckedChange={(checked) =>
            handleStatusChange(checked ? "open" : "closed")
          }
          disabled={event.status === "completed"}
        />
        <span className="text-sm text-muted-foreground">
          {event.status === "open" ? "Ouvert" : "Fermé"}
        </span>
      </div>
      {event.status === "completed" ? (
        <Button
          className="cursor-pointer"
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange("open")}
        >
          Réouvrir
        </Button>
      ) : (
        <Button
          className="cursor-pointer"
          variant="outline"
          size="sm"
          onClick={() => handleStatusChange("completed")}
          disabled={event.status === "completed"}
        >
          Terminer
        </Button>
      )}
      <Button
        className="cursor-pointer"
        variant="destructive"
        size="sm"
        onClick={handleDeleteEvent}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <CircularLoader size="sm" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
