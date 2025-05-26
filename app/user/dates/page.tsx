import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const evenements = [
  { date: "12 - 13 octobre", titre: "Salon Aquitec" },
  { date: "19 octobre", titre: "JPO / Concours" },
  { date: "23 octobre", titre: "JPO / Concours" },
  { date: "16 novembre", titre: "Salon des grandes écoles" },
  { date: "16 novembre", titre: "Salon des études supérieures" },
  { date: "23 novembre", titre: "Journée Portes Ouvertes" },
  { date: "30 novembre", titre: "Concours NEXT" },
  { date: "14 décembre", titre: "JPO / Concours" },
  { date: "10, 11 et 12 janvier", titre: "Salon de l'Étudiant" },
  { date: "16 et 17 janvier", titre: "Salon Infosup" },
  { date: "18 janvier", titre: "Journée Portes Ouvertes" },
  { date: "25 janvier", titre: "JPO / Concours" },
  { date: "5 février", titre: "Concours NEXT" },
  { date: "15 février", titre: "JPO / Concours" },
  { date: "22 mars", titre: "JPO / Concours" },
  { date: "26 mars", titre: "Concours NEXT" },
  { date: "12 avril", titre: "JPO / Concours" },
  { date: "14 mai", titre: "Concours NEXT" },
  { date: "24 mai", titre: "Concours NEXT" },
  { date: "7 juin", titre: "JPO / Concours" },
];

export default async function EvenementsPage() {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Événements</h1>
      <div className="space-y-4">
        {evenements.map((event, index) => (
          <Card key={index} className="p-4 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{event.titre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{event.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
