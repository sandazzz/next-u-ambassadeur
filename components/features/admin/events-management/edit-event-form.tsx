"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { updateEvent } from "./events-management.action";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import CircularLoader from "@/components/ui/circular-loader";
import { useRouter } from "next/navigation";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

export function EditEventForm({
  event,
}: {
  event: {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    status: string;
    slots: Array<{
      id: string;
      startTime: Date;
      endTime: Date;
    }>;
  };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    date: new Date(event.date).toISOString().split("T")[0],
    location: event.location,
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    event.slots.map((slot) => ({
      startTime: new Date(slot.startTime).toTimeString().slice(0, 5),
      endTime: new Date(slot.endTime).toTimeString().slice(0, 5),
    }))
  );

  const { executeAsync } = useAction(updateEvent, {
    onSuccess: () => {
      toast.success("Succès", {
        description: "L'événement a été modifié avec succès",
      });
      router.push("/admin/events-management");
    },
    onError: () => {
      toast.error("Erreur", {
        description:
          "Une erreur est survenue lors de la modification de l'événement",
      });
      setIsLoading(false);
    },
  });

  const handleSubmit = async () => {
    // Validation : au moins une plage horaire est requise
    if (timeSlots.length === 0) {
      toast.error("Erreur", {
        description: "Au moins une plage horaire est requise",
      });
      return;
    }

    // Validation : toutes les plages horaires doivent avoir des heures de début et de fin
    const hasInvalidSlots = timeSlots.some(
      (slot) => !slot.startTime || !slot.endTime
    );
    if (hasInvalidSlots) {
      toast.error("Erreur", {
        description:
          "Toutes les plages horaires doivent avoir une heure de début et de fin",
      });
      return;
    }

    setIsLoading(true);
    await executeAsync({
      id: event.id,
      ...formData,
      timeSlots,
    });
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: "", endTime: "" }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setTimeSlots(newTimeSlots);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/events-management")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Modifier l&apos;événement</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de l&apos;événement ci-dessous.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Titre de l'événement"
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description de l'événement"
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            disabled={isLoading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">Lieu principal</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Lieu de l'événement"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Plages horaires</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTimeSlot}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une plage
            </Button>
          </div>

          {timeSlots.map((slot, index) => (
            <div key={index} className="grid gap-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Plage {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimeSlot(index)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`startTime-${index}`}>Heure de début</Label>
                  <Input
                    id={`startTime-${index}`}
                    type="time"
                    value={slot.startTime}
                    onChange={(e) =>
                      updateTimeSlot(index, "startTime", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`endTime-${index}`}>Heure de fin</Label>
                  <Input
                    id={`endTime-${index}`}
                    type="time"
                    value={slot.endTime}
                    onChange={(e) =>
                      updateTimeSlot(index, "endTime", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t mt-6">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/events-management")}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <CircularLoader size="sm" /> : "Modifier"}
          </Button>
        </div>
      </div>
    </div>
  );
}
