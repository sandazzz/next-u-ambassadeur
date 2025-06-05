import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EvenementsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ambassador") {
    redirect("/");
  }
  const event = await prisma.event.findMany({
    orderBy: {
      date: "asc",
    },
  });
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Événements</h1>
      <div className="space-y-4">
        {event.map((event, index) => (
          <Card key={index} className="p-4 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {event.date.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
