"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUser } from "@/components/features/admin/users-management/users-management.action";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import CircularLoader from "@/components/ui/circular-loader";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z
    .string()
    .email("Email invalide")
    .refine(
      (email) => email.endsWith("@next-u.fr"),
      "L'email doit être un email Next-u"
    ),
  role: z.enum(["admin", "ambassador"]),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "ambassador",
    },
  });

  const { executeAsync, status } = useAction(updateUser, {
    onSuccess: () => {
      toast.success("Utilisateur mis à jour avec succès");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Erreur", {
        description:
          "Une erreur est survenue lors de la mise à jour de l'utilisateur",
      });
    },
  });

  // Mettre à jour les valeurs du formulaire quand l'utilisateur change
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        role: (user.role as "admin" | "ambassador") || "ambassador",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    await executeAsync({
      id: user.id,
      ...values,
    });
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l&apos;utilisateur ci-dessous. Cliquez
            sur Enregistrer lorsque vous avez terminé.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={status === "executing"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={status === "executing"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={status === "executing"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="ambassador">Ambassadeur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={status === "executing"}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={status === "executing"}>
                {status === "executing" ? (
                  <CircularLoader size="sm" />
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
