import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function LeaderboardPage() {
  const session = await auth();

  if (!session || session.user.role !== "ambassador") {
    redirect("/");
  }
  const ambassadors = await prisma.user.findMany({
    where: {
      role: "ambassador",
    },
    select: {
      name: true,
      credit: true,
    },
  });

  const sortedAmbassadors = ambassadors.sort(
    (a, b) => (b.credit ?? 0) - (a.credit ?? 0)
  );

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      {/* Titre principal */}
      <h1 className="text-xl font-bold text-center">
        Classement des Ambassadeurs
      </h1>

      {/* Section Classement TOP 3 */}
      <Card className="p-4 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">🏆 Top 3 Ambassadeurs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sortedAmbassadors.slice(0, 3).map((ambassador, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-sm"
            >
              <span>
                {index === 0 && "🥇"} {index === 1 && "🥈"}{" "}
                {index === 2 && "🥉"} {ambassador.name}
              </span>
              <Badge className="px-2 py-1">{ambassador.credit} crédits</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tableau du classement complet */}
      <Card className="p-4 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">📋 Classement Complet</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rang</TableHead>
                <TableHead>Ambassadeur</TableHead>
                <TableHead className="text-right">Crédits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAmbassadors.map((ambassador, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">#{index + 1}</TableCell>
                  <TableCell>{ambassador.name}</TableCell>
                  <TableCell className="text-right">
                    {ambassador.credit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
