"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coins, Search, Trophy, Medal, Award, Crown } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: "ambassador" | "user";
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Marie Dupont",
    email: "marie.dupont@next-u.fr",
    credits: 350,
    role: "ambassador",
  },
  {
    id: "2",
    name: "Jean Martin",
    email: "jean.martin@next-u.fr",
    credits: 275,
    role: "ambassador",
  },
  {
    id: "3",
    name: "Sophie Bernard",
    email: "sophie.bernard@next-u.fr",
    credits: 420,
    role: "ambassador",
  },
  {
    id: "4",
    name: "Pierre Durand",
    email: "pierre.durand@next-u.fr",
    credits: 180,
    role: "ambassador",
  },
  {
    id: "5",
    name: "Emma Leroy",
    email: "emma.leroy@next-u.fr",
    credits: 310,
    role: "ambassador",
  },
  {
    id: "6",
    name: "Lucas Moreau",
    email: "lucas.moreau@next-u.fr",
    credits: 95,
    role: "ambassador",
  },
  {
    id: "7",
    name: "Camille Petit",
    email: "camille.petit@next-u.fr",
    credits: 225,
    role: "ambassador",
  },
  {
    id: "8",
    name: "Thomas Roux",
    email: "thomas.roux@next-u.fr",
    credits: 160,
    role: "ambassador",
  },
];

export function CreditsManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adjustment, setAdjustment] = useState({
    amount: 0,
    type: "add" as "add" | "remove",
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Classement des ambassadeurs par crédits
  const ambassadorRanking = users
    .filter((user) => user.role === "ambassador")
    .sort((a, b) => b.credits - a.credits)
    .slice(0, 10); // Top 10

  const handleAdjustCredits = () => {
    if (selectedUser && adjustment.amount > 0) {
      const finalAmount =
        adjustment.type === "add" ? adjustment.amount : -adjustment.amount;

      // Update user credits
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? { ...user, credits: user.credits + finalAmount }
            : user
        )
      );

      // Reset form
      setAdjustment({ amount: 0, type: "add" });
      setSelectedUser(null);
    }
  };

  const getRankIcon = (position: number) => {
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
  };

  const getRankBadge = (position: number) => {
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
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des crédits
          </h1>
          <p className="text-muted-foreground">
            Gérez les points des ambassadeurs et consultez le classement
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Crédits par utilisateur</CardTitle>
              <CardDescription>
                Gérez les crédits de tous les utilisateurs
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Crédits</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32`}
                            />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "ambassador" ? "default" : "secondary"
                          }
                        >
                          {user.role === "ambassador"
                            ? "Ambassadeur"
                            : "Utilisateur"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Coins className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{user.credits}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUsers(
                                users.map((u) =>
                                  u.id === user.id
                                    ? { ...u, credits: u.credits + 10 }
                                    : u
                                )
                              );
                            }}
                          >
                            +10
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUsers(
                                users.map((u) =>
                                  u.id === user.id
                                    ? {
                                        ...u,
                                        credits: Math.max(0, u.credits - 10),
                                      }
                                    : u
                                )
                              );
                            }}
                          >
                            -10
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              handleAdjustCredits();
                            }}
                          >
                            <Coins className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Classement des ambassadeurs</span>
              </CardTitle>
              <CardDescription>
                Top 10 des ambassadeurs par crédits
              </CardDescription>
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
                          ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(position)}
                          {getRankBadge(position)}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                          />
                          <AvatarFallback className="text-xs">
                            {ambassador.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {ambassador.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ambassador.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-sm">
                          {ambassador.credits}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
