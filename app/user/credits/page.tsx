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

// Données fictives
const ambassadors = [
  { name: "Alex Dupont", credits: 2 },
  { name: "Emma Martin", credits: 5 },
  { name: "Lucas Bernard", credits: 5 },
  { name: "Sophie Morel", credits: 3 },
  { name: "Maxime Lefevre", credits: 1 },
  { name: "Julie Durant", credits: 3 },
  { name: "Nicolas Charpentier", credits: 2 },
  { name: "Camille Robert", credits: 1 },
  { name: "Antoine Dubois", credits: 1 },
  { name: "Léa Fontaine", credits: 1 },
];

// Tri des ambassadeurs par nombre de crédits (ordre décroissant)
const sortedAmbassadors = ambassadors.sort((a, b) => b.credits - a.credits);

export default async function LeaderboardPage() {
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
              <Badge className="px-2 py-1">{ambassador.credits} crédits</Badge>
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
                    {ambassador.credits}
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
