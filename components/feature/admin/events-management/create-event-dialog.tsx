"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "./events-management.action";
import { toast } from "sonner";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import CircularLoader from "@/components/ui/circular-loader";

interface TimeSlot {
  startTime: string;
  endTime: string;
  location: string;
}

export function CreateEventDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
    });
    setTimeSlots([]);
    setIsLoading(false);
  };

  const { executeAsync } = useAction(createEvent, {
    onSuccess: () => {
      resetForm();
      setIsOpen(false);
      toast.success("Succès", {
        description: "L'événement a été créé avec succès",
      });
    },
    onError: () => {
      toast.error("Erreur", {
        description:
          "Une erreur est survenue lors de la création de l'événement",
      });
      setIsLoading(false);
    },
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    await executeAsync({
      ...formData,
      timeSlots,
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsOpen(open);
  };

  const addTimeSlot = () => {
    setTimeSlots([
      ...timeSlots,
      { startTime: "", endTime: "", location: formData.location },
    ]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setTimeSlots(newTimeSlots);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Créer un événement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un événement</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouvel
            événement.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
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
        </div>
        <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <CircularLoader size="sm" /> : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
