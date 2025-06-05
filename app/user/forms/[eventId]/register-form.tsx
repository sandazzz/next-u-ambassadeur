"use client";

import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerToEvent } from "../actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Event, EventSlot, UserSlot } from "@prisma/client";

const formSchema = z.object({
  slotIds: z
    .array(z.string())
    .min(1, "Veuillez sélectionner au moins une plage horaire"),
});

type EventWithSlots = Event & {
  slots: (EventSlot & {
    userSlots: UserSlot[];
  })[];
};

export function RegisterForm({ event }: { event: EventWithSlots }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slotIds: [],
    },
  });

  const { execute, status } = useAction(registerToEvent, {
    onSuccess: () => {
      toast.success("Demande d'inscription envoyée", {
        description:
          "Votre demande a été enregistrée et est en attente de validation",
      });
      form.reset();
    },
    onError: (error) => {
      toast.error("Erreur", {
        description:
          error.error.serverError ||
          "Une erreur est survenue lors de l'inscription",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Envoyer une inscription pour chaque plage horaire sélectionnée
    Promise.all(
      values.slotIds.map((slotId) => execute({ slotId, eventId: event.id }))
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="slotIds"
          render={() => (
            <FormItem className="space-y-3">
              <FormLabel>Plages horaires</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  {event.slots.map((slot) => (
                    <FormField
                      key={slot.id}
                      control={form.control}
                      name="slotIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={slot.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(slot.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, slot.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== slot.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <Label
                                htmlFor={slot.id}
                                className="flex flex-col cursor-pointer"
                              >
                                <span className="font-medium">
                                  {new Intl.DateTimeFormat("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(slot.startTime)}{" "}
                                  -{" "}
                                  {new Intl.DateTimeFormat("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(slot.endTime)}
                                </span>
                              </Label>
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={status === "executing"}
        >
          {status === "executing"
            ? "Envoi en cours..."
            : "Envoyer la demande d'inscription"}
        </Button>
      </form>
    </Form>
  );
}
