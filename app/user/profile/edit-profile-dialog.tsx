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
import { toast } from "sonner";
import { useState } from "react";
import { Pencil } from "lucide-react";
import CircularLoader from "@/components/ui/circular-loader";
import { updateProfile } from "@/app/user/profile/actions";
import { useAction } from "next-safe-action/hooks";

export function EditProfileDialog({
  profile,
}: {
  profile: {
    name: string | null;
    description: string | null;
    school: string | null;
    promoYear: number | null;
    instagram: string | null;
    phone: string | null;
    favoriteMoment: string | null;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || "",
    description: profile.description || "",
    school: profile.school || "",
    promoYear: profile.promoYear?.toString() || "",
    instagram: profile.instagram || "",
    phone: profile.phone || "",
    favoriteMoment: profile.favoriteMoment || "",
  });

  const { execute, status } = useAction(updateProfile, {
    onSuccess: () => {
      toast.success("Succès", {
        description: "Votre profil a été mis à jour avec succès",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Erreur", {
        description:
          error.error.serverError ||
          "Une erreur est survenue lors de la mise à jour du profil",
      });
    },
  });

  const handleSubmit = () => {
    execute(formData);
  };

  const isLoading = status === "executing";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Pencil className="h-4 w-4 mr-2" />
          Modifier mon profil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm border-accent-foreground rounded-2xl">
        <DialogHeader>
          <DialogTitle>Modifier mon profil</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre profil ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Votre nom"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="school">École</Label>
            <Input
              id="school"
              value={formData.school}
              onChange={(e) =>
                setFormData({ ...formData, school: e.target.value })
              }
              placeholder="Votre école"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="promoYear">Année de promotion</Label>
            <Input
              id="promoYear"
              type="number"
              value={formData.promoYear}
              onChange={(e) =>
                setFormData({ ...formData, promoYear: e.target.value })
              }
              placeholder="Votre année de promotion"
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
              placeholder="Une brève description de vous"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.instagram}
              onChange={(e) =>
                setFormData({ ...formData, instagram: e.target.value })
              }
              placeholder="Votre compte Instagram"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Votre numéro de téléphone"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="favoriteMoment">Moment préféré</Label>
            <Textarea
              id="favoriteMoment"
              value={formData.favoriteMoment}
              onChange={(e) =>
                setFormData({ ...formData, favoriteMoment: e.target.value })
              }
              placeholder="Votre moment préféré"
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
          <Button onClick={handleSubmit} disabled={isLoading} className="mb-4">
            {isLoading ? <CircularLoader size="sm" /> : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
