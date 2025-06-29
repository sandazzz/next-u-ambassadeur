import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function Form() {
  const session = await auth();

  if (!session || session.user.role !== "ambassador") {
    redirect("/");
  }

  const openEvents = await prisma.event.findMany({
    where: {
      status: "open",
    },
    include: {
      slots: {
        include: {
          userSlots: {
            where: {
              userId: session.user.id,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="container px-4 py-8 max-w-2xl">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Événements à venir
        </h1>
        <p className="text-muted-foreground">
          Découvrez et inscrivez-vous aux prochains événements
        </p>
        <Badge variant="outline" className="w-fit">
          {openEvents.length} événement{openEvents.length > 1 ? "s" : ""}{" "}
          disponible{openEvents.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="space-y-8">
        {openEvents.map((event) => {
          const userSlots = event.slots.flatMap((slot) => slot.userSlots);
          const userRegistration = userSlots[0];

          return (
            <div key={event.id} className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

              {/* Event card */}
              <div className="relative pl-12">
                {/* Timeline dot */}
                <div className="absolute left-0 top-6 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge variant="secondary" className="ml-2">
                          {event.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground">
                        {event.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {event.date.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{event.location}</span>
                        </div>
                      )}
                    </div>

                    {userRegistration?.status === "confirmed" && (
                      <div className="space-y-3">
                        <Separator />
                        <div className="flex items-center gap-2 text-sm font-medium text-primary">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Plages horaires confirmées</span>
                        </div>
                        <div className="grid gap-2">
                          {event.slots
                            .filter((slot) =>
                              slot.userSlots.some(
                                (userSlot) =>
                                  userSlot.userId === session.user.id &&
                                  userSlot.status === "confirmed"
                              )
                            )
                            .map((slot) => (
                              <div
                                key={slot.id}
                                className="flex items-center gap-2 text-sm bg-muted/50 p-3 rounded-lg"
                              >
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {new Date(slot.startTime).toLocaleTimeString(
                                    "fr-FR",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}{" "}
                                  -{" "}
                                  {new Date(slot.endTime).toLocaleTimeString(
                                    "fr-FR",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4">
                    {userRegistration ? (
                      <div className="w-full">
                        <Badge
                          variant={
                            userRegistration.status === "confirmed"
                              ? "default"
                              : "secondary"
                          }
                          className="w-full justify-center py-2"
                        >
                          {userRegistration.status === "confirmed"
                            ? "Inscription confirmée"
                            : "Inscription en attente"}
                        </Badge>
                      </div>
                    ) : (
                      <Button className="w-full" asChild>
                        <Link href={`/user/forms/${event.id}`}>
                          S&apos;inscrire
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </div>
          );
        })}

        {openEvents.length === 0 && (
          <Card className="text-center py-12">
            <CardContent className="space-y-2">
              <h3 className="text-lg font-medium text-muted-foreground">
                Aucun événement disponible pour le moment
              </h3>
              <p className="text-sm text-muted-foreground">
                Revenez plus tard pour voir les nouveaux événements
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
