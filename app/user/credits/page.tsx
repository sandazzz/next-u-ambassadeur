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
import { prisma } from "@/lib/prisma";
import { Trophy, Medal, Crown } from "lucide-react";

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
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Classement des Ambassadeurs
        </h1>
        <p className="text-sm text-muted-foreground">
          Découvrez les meilleurs ambassadeurs de la communauté
        </p>
      </div>

      {/* Section Classement TOP 3 */}
      <Card className="p-4 shadow-lg bg-gradient-to-br from-card to-card/95 border-blue-400/20 hover:border-blue-400/40 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-400">
            <Trophy className="h-5 w-5" />
            Top 3 Ambassadeurs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedAmbassadors.slice(0, 3).map((ambassador, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-background/50 to-background/30 hover:from-background/70 hover:to-background/50 transition-all duration-300 group"
            >
              <span className="flex items-center gap-2 font-medium">
                {index === 0 && <Crown className="h-4 w-4 text-yellow-400" />}
                {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                {index === 2 && <Medal className="h-4 w-4 text-amber-600" />}
                {ambassador.name}
              </span>
              <Badge className="px-2 py-1 bg-blue-400/10 text-blue-400 border border-blue-400/20 group-hover:border-blue-400/40 transition-colors duration-300">
                {ambassador.credit ?? 0} crédits
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tableau du classement complet */}
      <Card className="p-4 shadow-lg bg-gradient-to-br from-card to-card/95 border-blue-400/20 hover:border-blue-400/40 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-400">
            <Trophy className="h-5 w-5" />
            Classement Complet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-background/50">
                <TableHead className="text-blue-400/80">Rang</TableHead>
                <TableHead className="text-blue-400/80">Ambassadeur</TableHead>
                <TableHead className="text-right text-blue-400/80">
                  Crédits
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAmbassadors.map((ambassador, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-background/50 transition-colors duration-300"
                >
                  <TableCell className="font-medium text-muted-foreground">
                    #{index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {ambassador.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-blue-400/10 text-blue-400 border-blue-400/20"
                    >
                      {ambassador.credit ?? 0}
                    </Badge>
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
