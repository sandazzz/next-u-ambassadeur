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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "ambassador" | "user";
  status: "active" | "inactive";
  credits: number;
  joinDate: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Marie Dupont",
    email: "marie.dupont@next-u.fr",
    role: "ambassador",
    status: "active",
    credits: 150,
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Jean Martin",
    email: "jean.martin@next-u.fr",
    role: "ambassador",
    status: "active",
    credits: 75,
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Sophie Bernard",
    email: "sophie.bernard@next-u.fr",
    role: "ambassador",
    status: "active",
    credits: 200,
    joinDate: "2024-01-10",
  },
];

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "ambassador" as const,
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.email.endsWith("@next-u.fr")) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: "active",
        credits: 0,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, user]);
      setNewUser({ name: "", email: "", role: "ambassador" });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "destructive",
      ambassador: "default",
      user: "secondary",
    } as const;
    return (
      <Badge variant={variants[role as keyof typeof variants]}>{role}</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status === "active" ? "Actif" : "Inactif"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des utilisateurs
          </h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs ayant accès à l&apos;application
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Créez un nouveau compte utilisateur pour la plateforme Next-u
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="Nom et prénom"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Next-u</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="utilisateur@next-u.fr"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "admin" | "ambassador" | "user") =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambassador">Ambassadeur</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleAddUser}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {users.length} utilisateur(s) au total
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
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Crédits</TableHead>
                <TableHead>Date d&apos;inscription</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.credits}</TableCell>
                  <TableCell>
                    {new Date(user.joinDate).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
  );
}
