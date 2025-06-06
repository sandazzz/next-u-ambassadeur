import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { UserSlotActions } from "./user-slot-actions";
import prisma from "@/lib/prisma";

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
      },
    },
  });

  if (!event) {
    throw new Error("Événement non trouvé");
  }

  return event;
}

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
          <p className="text-muted-foreground mt-2">{event.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(event.status)}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="registrations">Inscriptions</TabsTrigger>
          <TabsTrigger value="confirmed">Participants confirmés</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Date et heure
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatDate(event.date)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatTime(event.date)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lieu</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{event.location}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    new Set(
                      event.slots.flatMap((slot) =>
                        slot.userSlots.map((userSlot) => userSlot.userId)
                      )
                    ).size
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  étudiants inscrits
                </p>
              </CardContent>
            </Card>
          </div>

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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {event.slots.map((slot) => (
                  <Card key={slot.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatTime(slot.startTime)} -{" "}
                          {formatTime(slot.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">
                          {slot.userSlots.length} inscription
                          {slot.userSlots.length > 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Liste des inscriptions</CardTitle>
              <CardDescription>
                Gérez les inscriptions des étudiants pour cet événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.slots.map((slot) => (
                  <div key={slot.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <h3 className="font-medium">
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </h3>
                    </div>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Étudiant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {slot.userSlots.map((userSlot) => (
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
                                <Badge
                                  variant={
                                    userSlot.status === "confirmed"
                                      ? "default"
                                      : userSlot.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {userSlot.status === "confirmed"
                                    ? "Confirmé"
                                    : userSlot.status === "rejected"
                                    ? "Refusé"
                                    : "En attente"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <UserSlotActions
                                  userId={userSlot.userId}
                                  slotId={userSlot.slotId}
                                  currentStatus={
                                    userSlot.status as
                                      | "confirmed"
                                      | "rejected"
                                      | "waiting_list"
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirmed">
          <Card>
            <CardHeader>
              <CardTitle>Participants confirmés</CardTitle>
              <CardDescription>
                Liste des étudiants confirmés pour cet événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.slots.map((slot) => (
                  <div key={slot.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <h3 className="font-medium">
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </h3>
                    </div>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Étudiant</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {slot.userSlots
                            .filter(
                              (userSlot) => userSlot.status === "confirmed"
                            )
                            .map((userSlot) => (
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
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
