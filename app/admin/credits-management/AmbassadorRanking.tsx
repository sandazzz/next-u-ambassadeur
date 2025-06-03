import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coins, Trophy, Medal, Award, Crown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  credit: number | null;
  role: string;
}

function getRankIcon(position: number) {
  switch (position) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return <Trophy className="h-4 w-4 text-muted-foreground" />;
  }
}

function getRankBadge(position: number) {
  if (position <= 3) {
    const variants = {
      1: "default",
      2: "secondary",
      3: "outline",
    } as const;
    return (
      <Badge variant={variants[position as keyof typeof variants]}>
        #{position}
      </Badge>
    );
  }
  return <Badge variant="outline">#{position}</Badge>;
}

export function AmbassadorRanking({ users }: { users: User[] }) {
  const ambassadorRanking = users
    .filter((user) => user.role === "ambassador")
    .sort((a, b) => (b.credit ?? 0) - (a.credit ?? 0))
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Classement des ambassadeurs</span>
        </CardTitle>
        <CardDescription>Top 10 des ambassadeurs par crédits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ambassadorRanking.map((ambassador, index) => {
            const position = index + 1;
            return (
              <div
                key={ambassador.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  position <= 3
                    ? "bg-linear-to-r from-yellow-50 to-orange-50 border-yellow-200"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(position)}
                    {getRankBadge(position)}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                    <AvatarFallback className="text-xs">
                      {ambassador.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{ambassador.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {ambassador.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold text-sm">
                    {ambassador.credit ?? 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
