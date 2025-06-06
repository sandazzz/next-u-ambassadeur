import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
import { Calendar, MapPin } from "lucide-react";

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
    <div className="container px-4 max-w-4xl py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Événements à venir</h1>
        <Badge variant="outline" className="text-sm">
          {openEvents.length} événement{openEvents.length > 1 ? "s" : ""}{" "}
          disponible{openEvents.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {openEvents.map((event) => {
          // Vérifier si l'utilisateur est déjà inscrit à cet événement
          const userSlots = event.slots.flatMap((slot) => slot.userSlots);
          const userRegistration = userSlots[0]; // Prendre la première inscription trouvée

          return (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <Badge variant="secondary" className="ml-2">
                    {event.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {event.date.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {userRegistration?.status === "confirmed" && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Plages horaires confirmées :
                      </div>
                      <div className="space-y-1">
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
                              className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md"
                            >
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
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
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
          );
        })}
      </div>

      {openEvents.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">
            Aucun événement disponible pour le moment
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Revenez plus tard pour voir les nouveaux événements
          </p>
        </div>
      )}
    </div>
  );
}
