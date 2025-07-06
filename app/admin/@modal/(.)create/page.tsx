"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import CircularLoader from "@/components/ui/circular-loader";
import { createUser } from "@/app/admin/(users-management)/action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePathname, useRouter } from "next/navigation";

const createUserSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide").min(1, "L'email est requis"),
  role: z.enum(["admin", "ambassador"]),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

export default function CreateUserModal() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "ambassador",
    },
  });

  const { executeAsync } = useAction(createUser, {
    onSuccess: () => {
      form.reset();
      setIsLoading(false);
      toast.success("Succès", {
        description: "L'utilisateur a été créé avec succès",
      });
      router.push("/admin");
    },
    onError: () => {
      toast.error("Erreur", {
        description:
          "Une erreur est survenue lors de la création de l'utilisateur",
      });
      setIsLoading(false);
    },
  });

  const handleSubmit = async (data: CreateUserFormValues) => {
    setIsLoading(true);
    await executeAsync(data);
  };

  return (
    <Dialog
      open={pathname === "/admin/create"}
      onOpenChange={() => router.back()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
          <DialogDescription>
            Créez un nouveau compte utilisateur pour la plateforme Next-U
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nom et prénom"
                      disabled={isLoading}
                      {...field}
                    />
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
                  <FormLabel>Email Next-u</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="prénom.nom@next-u.fr"
                      disabled={isLoading}
                      {...field}
                    />
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
                  <Select defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ambassador">Ambassadeur</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <CircularLoader size="sm" /> : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
