import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { updateUserSlotStatus } from "./actions";

async function getEventDetails(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      slots: {
        include: {
          userSlots: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          startTime: "asc",
        },
      },
    },
  });

  if (!event) {
    throw new Error("Événement non trouvé");
  }

  return event;
}

const getStatusBadge = (status: string) => {
  const variants = {
    open: "default",
    closed: "secondary",
    completed: "outline",
  } as const;

  const labels = {
    open: "Ouvert",
    closed: "Fermé",
    completed: "Terminé",
  };

  return (
    <Badge variant={variants[status as keyof typeof variants]}>
      {labels[status as keyof typeof labels]}
    </Badge>
  );
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const event = await getEventDetails(eventId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
        <p className="text-muted-foreground">{event.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium">{formatDate(event.date)}</div>
                <div className="text-sm text-muted-foreground">
                  {formatTime(event.date)}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <div>{event.location}</div>
            </div>
            <div className="flex items-center">
              {getStatusBadge(event.status)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plages horaires</CardTitle>
            <CardDescription>
              {event.slots.length} plage{event.slots.length > 1 ? "s" : ""}{" "}
              horaire{event.slots.length > 1 ? "s" : ""} disponible
              {event.slots.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {event.slots.map((slot) => (
                <div key={slot.id} className="p-4 border rounded-lg">
                  <div className="font-medium">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {slot.userSlots.length} inscription
                    {slot.userSlots.length > 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inscriptions</CardTitle>
          <CardDescription>
            {event.slots.reduce((acc, slot) => acc + slot.userSlots.length, 0)}{" "}
            étudiant
            {event.slots.reduce((acc, slot) => acc + slot.userSlots.length, 0) >
            1
              ? "s"
              : ""}{" "}
            inscrit
            {event.slots.reduce((acc, slot) => acc + slot.userSlots.length, 0) >
            1
              ? "s"
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Plage horaire</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.slots.map((slot) =>
                slot.userSlots.map((userSlot) => (
                  <TableRow key={`${userSlot.userId}-${slot.id}`}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={userSlot.user.image || undefined}
                            alt={userSlot.user.name || ""}
                          />
                          <AvatarFallback>
                            {userSlot.user.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {userSlot.user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {userSlot.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          userSlot.status === "confirmed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {userSlot.status === "confirmed"
                          ? "Confirmé"
                          : "En attente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <form action={updateUserSlotStatus}>
                        <input
                          type="hidden"
                          name="userId"
                          value={userSlot.userId}
                        />
                        <input
                          type="hidden"
                          name="slotId"
                          value={userSlot.slotId}
                        />
                        <input
                          type="hidden"
                          name="status"
                          value={
                            userSlot.status === "confirmed"
                              ? "rejected"
                              : "confirmed"
                          }
                        />
                        <Button
                          type="submit"
                          variant={
                            userSlot.status === "confirmed"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {userSlot.status === "confirmed"
                            ? "Refuser"
                            : "Confirmer"}
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
