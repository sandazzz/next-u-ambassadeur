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
import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import CircularLoader from "@/components/ui/circular-loader";

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

  const { executeAsync } = useAction(createEvent, {
    onSuccess: () => {
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
      });
      setIsOpen(false);
      setIsLoading(false);
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
    await executeAsync(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Créer un événement
        </Button>
      </DialogTrigger>
      <DialogContent>
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
            <Label htmlFor="time">Heure</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Lieu</Label>
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
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
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
