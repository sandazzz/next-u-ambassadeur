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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Check,
  X,
  UserCheck,
  Clock,
  Mail,
} from "lucide-react";

interface Ambassador {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: "registered" | "confirmed" | "rejected";
  credits: number;
  experience: string;
  motivation: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: "planned" | "ongoing" | "completed" | "cancelled";
  isScheduled: boolean;
  credits: number;
}

const mockEvent: Event = {
  id: "1",
  title: "Workshop IA et Machine Learning",
  description:
    "Introduction aux concepts fondamentaux de l'IA et du Machine Learning. Cet atelier pratique vous permettra de découvrir les bases de l'intelligence artificielle et de créer vos premiers modèles.",
  date: "2024-12-28",
  time: "14:00",
  location: "Campus Next-u Paris",
  maxParticipants: 30,
  currentParticipants: 15,
  status: "planned",
  isScheduled: true,
  credits: 50,
};

const mockAmbassadors: Ambassador[] = [
  {
    id: "1",
    name: "Marie Dupont",
    email: "marie.dupont@next-u.fr",
    registrationDate: "2024-12-25",
    status: "registered",
    credits: 150,
    experience:
      "3 ans d'expérience en développement IA, plusieurs projets personnels",
    motivation:
      "Je suis passionnée par l'IA et j'aimerais partager mes connaissances avec la communauté.",
  },
  {
    id: "2",
    name: "Jean Martin",
    email: "jean.martin@next-u.fr",
    registrationDate: "2024-12-24",
    status: "confirmed",
    credits: 75,
    experience: "2 ans en data science, formation en machine learning",
    motivation: "Envie d'apprendre et d'aider les autres à découvrir l'IA.",
  },
  {
    id: "3",
    name: "Sophie Bernard",
    email: "sophie.bernard@next-u.fr",
    registrationDate: "2024-12-23",
    status: "registered",
    credits: 200,
    experience: "5 ans en recherche IA, doctorante en machine learning",
    motivation: "Transmettre ma passion pour la recherche en IA aux étudiants.",
  },
  {
    id: "4",
    name: "Pierre Durand",
    email: "pierre.durand@next-u.fr",
    registrationDate: "2024-12-22",
    status: "rejected",
    credits: 25,
    experience: "Débutant en programmation",
    motivation: "Découvrir l'IA pour mon projet personnel.",
  },
];

interface EventDetailsProps {
  eventId: string;
  onBack: () => void;
}

export function EventDetails({ onBack }: EventDetailsProps) {
  const [event, setEvent] = useState<Event>(mockEvent);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>(mockAmbassadors);
  const [, setSelectedAmbassador] = useState<Ambassador | null>(null);

  const handleToggleScheduled = () => {
    setEvent({ ...event, isScheduled: !event.isScheduled });
  };

  const handleConfirmAmbassador = (id: string) => {
    setAmbassadors(
      ambassadors.map((amb) =>
        amb.id === id ? { ...amb, status: "confirmed" as const } : amb
      )
    );
  };

  const handleRejectAmbassador = (id: string) => {
    setAmbassadors(
      ambassadors.map((amb) =>
        amb.id === id ? { ...amb, status: "rejected" as const } : amb
      )
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      registered: "secondary",
      confirmed: "default",
      rejected: "destructive",
    } as const;

    const labels = {
      registered: "Inscrit",
      confirmed: "Confirmé",
      rejected: "Rejeté",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "registered":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "confirmed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const registeredCount = ambassadors.filter(
    (amb) => amb.status === "registered"
  ).length;
  const confirmedCount = ambassadors.filter(
    (amb) => amb.status === "confirmed"
  ).length;
  const rejectedCount = ambassadors.filter(
    (amb) => amb.status === "rejected"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
          <p className="text-muted-foreground">
            Détails et gestion des ambassadeurs
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l&apos;événement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {new Date(event.date).toLocaleDateString("fr-FR")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="font-medium">{event.location}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {event.currentParticipants}/{event.maxParticipants}{" "}
                      participants
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Capacité maximale
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-medium">{event.credits} crédits</div>
                  <div className="text-sm text-muted-foreground">
                    Attribués aux participants
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t">
                <Switch
                  id="scheduled"
                  checked={event.isScheduled}
                  onCheckedChange={handleToggleScheduled}
                />
                <Label htmlFor="scheduled">Événement planifié</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ambassadeurs inscrits</CardTitle>
              <CardDescription>
                Gérez les inscriptions des ambassadeurs à cet événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ambassadeur</TableHead>
                    <TableHead>Date d&apos;inscription</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ambassadors.map((ambassador) => (
                    <TableRow key={ambassador.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32`}
                            />
                            <AvatarFallback>
                              {ambassador.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{ambassador.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {ambassador.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(
                          ambassador.registrationDate
                        ).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(ambassador.status)}
                          {getStatusBadge(ambassador.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedAmbassador(ambassador)
                                }
                              >
                                Détails
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Profil de l&apos;ambassadeur
                                </DialogTitle>
                                <DialogDescription>
                                  Informations détaillées sur {ambassador.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-12 w-12">
                                    <AvatarImage
                                      src={`/placeholder.svg?height=48&width=48`}
                                    />
                                    <AvatarFallback>
                                      {ambassador.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {ambassador.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {ambassador.email}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {ambassador.credits} crédits
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Expérience
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {ambassador.experience}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Motivation
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {ambassador.motivation}
                                  </p>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline">Fermer</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          {ambassador.status === "registered" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleConfirmAmbassador(ambassador.id)
                                }
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleRejectAmbassador(ambassador.id)
                                }
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">En attente</span>
                </div>
                <span className="font-medium">{registeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Confirmés</span>
                </div>
                <span className="font-medium">{confirmedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <X className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Rejetés</span>
                </div>
                <span className="font-medium">{rejectedCount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                onClick={() => {
                  ambassadors
                    .filter((amb) => amb.status === "registered")
                    .forEach((amb) => handleConfirmAmbassador(amb.id));
                }}
                disabled={registeredCount === 0}
              >
                Confirmer tous les inscrits
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Logic to send notification to all confirmed ambassadors
                  alert(
                    "Notification envoyée à tous les ambassadeurs confirmés"
                  );
                }}
                disabled={confirmedCount === 0}
              >
                Notifier les confirmés
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
