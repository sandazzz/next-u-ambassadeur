import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function EvenementsPage() {
  const session = await auth();

  if (!session || session.user.role !== "ambassador") {
    redirect("/");
  }

  const events = await prisma.event.findMany({
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="container px-4 py-6 max-w-2xl">
      <div className="flex flex-col gap-1.5 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
          Historique des événements
        </h1>
        <p className="text-sm text-muted-foreground">
          Consultez l&apos;historique de tous les événements
        </p>
        <Badge
          variant="outline"
          className="w-fit text-xs bg-gradient-to-r from-background to-background/80"
        >
          {events.length} événement{events.length > 1 ? "s" : ""}
        </Badge>
      </div>

      <Card className="border-border/50 shadow-sm bg-gradient-to-b from-background to-background/95 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="relative group">
                {/* Timeline line */}
                <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-400/40 via-blue-400/60 to-blue-400/40 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.3)]" />

                {/* Event card */}
                <div className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-5 w-6 h-6 rounded-full bg-background border border-blue-400/30 flex items-center justify-center group-hover:border-blue-400/50 transition-colors duration-300 shadow-[0_0_8px_rgba(96,165,250,0.2)] group-hover:shadow-[0_0_12px_rgba(96,165,250,0.4)]">
                    <Calendar className="h-3 w-3 text-blue-400/70 group-hover:text-blue-400/90 transition-colors duration-300" />
                  </div>

                  <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] hover:border-primary/20 bg-gradient-to-br from-card to-card/95">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col gap-1.5">
                        <CardTitle className="text-lg font-medium bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                          {event.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground/80">
                          {event.description}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground/90 group-hover:text-muted-foreground transition-colors duration-300">
                          <Calendar className="h-3.5 w-3.5" />
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
                          <div className="flex items-center gap-2 text-sm text-muted-foreground/90 group-hover:text-muted-foreground transition-colors duration-300">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="font-medium">
                              {event.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <Card className="text-center py-8 border-border/50 bg-gradient-to-br from-card/50 to-card/30">
                <CardContent className="space-y-1.5">
                  <h3 className="text-base font-medium text-muted-foreground">
                    Aucun événement dans l&apos;historique
                  </h3>
                  <p className="text-sm text-muted-foreground/80">
                    Les événements passés apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
