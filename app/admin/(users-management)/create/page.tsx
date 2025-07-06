"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import CircularLoader from "@/components/ui/circular-loader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/admin/(users-management)/actions";
import { z } from "zod";

type CreateUserFormValues = {
  name: string;
  email: string;
  role: "admin" | "ambassador";
};

export default function CreateUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Le nom est requis"),
        email: z.string().email("Email invalide").min(1, "L'email est requis"),
        role: z.enum(["admin", "ambassador"]),
      })
    ),
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
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Ajouter un nouvel utilisateur</h1>
          <p className="text-muted-foreground">
            Créez un nouveau compte utilisateur pour la plateforme Next-U
          </p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un rôle" />
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
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin")}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <CircularLoader size="sm" /> : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
