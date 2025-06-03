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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Plus, MapPin, Users, Edit, Trash2, Eye } from "lucide-react";

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

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Workshop IA et Machine Learning",
    description: "Introduction aux concepts fondamentaux de l'IA",
    date: "2024-12-28",
    time: "14:00",
    location: "Campus Next-u Paris",
    maxParticipants: 30,
    currentParticipants: 15,
    status: "planned",
    isScheduled: true,
    credits: 50,
  },
  {
    id: "2",
    title: "Hackathon Next-u 2024",
    description: "48h pour développer une solution innovante",
    date: "2024-12-30",
    time: "09:00",
    location: "Campus Next-u Lyon",
    maxParticipants: 100,
    currentParticipants: 45,
    status: "planned",
    isScheduled: false,
    credits: 100,
  },
  {
    id: "3",
    title: "Conférence Tech Trends",
    description: "Les dernières tendances technologiques",
    date: "2024-12-20",
    time: "10:00",
    location: "Campus Next-u Marseille",
    maxParticipants: 200,
    currentParticipants: 120,
    status: "completed",
    isScheduled: true,
    credits: 75,
  },
];

interface EventsManagementProps {
  onViewEventDetails?: (eventId: string) => void;
}

export function EventsManagement({
  onViewEventDetails,
}: EventsManagementProps) {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: 0,
    credits: 0,
    isScheduled: false,
  });

  const handleCreateEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.location) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        maxParticipants: newEvent.maxParticipants,
        currentParticipants: 0,
        status: "planned",
        isScheduled: newEvent.isScheduled,
        credits: newEvent.credits,
      };
      setEvents([...events, event]);
      setNewEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        maxParticipants: 0,
        credits: 0,
        isScheduled: false,
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const handleToggleScheduled = (id: string) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, isScheduled: !event.isScheduled } : event
      )
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      planned: "default",
      ongoing: "secondary",
      completed: "outline",
      cancelled: "destructive",
    } as const;

    const labels = {
      planned: "Planifié",
      ongoing: "En cours",
      completed: "Terminé",
      cancelled: "Annulé",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const scheduledEvents = events.filter((e) => e.isScheduled).length;
  const unscheduledEvents = events.filter((e) => !e.isScheduled).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des événements
          </h1>
          <p className="text-muted-foreground">
            Créez et gérez les événements de la plateforme
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer un événement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouvel événement</DialogTitle>
              <DialogDescription>
                Planifiez un nouvel événement pour la communauté Next-u
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre de l&apos;événement</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Ex: Workshop React Avancé"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  placeholder="Décrivez l'événement..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  placeholder="Ex: Campus Next-u Paris"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="maxParticipants">
                    Nombre max de participants
                  </Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newEvent.maxParticipants || ""}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        maxParticipants: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credits">Crédits attribués</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={newEvent.credits || ""}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        credits: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="25"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isScheduled"
                  checked={newEvent.isScheduled}
                  onCheckedChange={(checked) =>
                    setNewEvent({ ...newEvent, isScheduled: checked })
                  }
                />
                <Label htmlFor="isScheduled">Événement planifié</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleCreateEvent}>
                Créer l&apos;événement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total événements
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planifiés</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non planifiés</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unscheduledEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Participants inscrits
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((sum, e) => sum + e.currentParticipants, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des événements</CardTitle>
          <CardDescription>
            Gérez tous vos événements depuis cette interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Événement</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Planifié</TableHead>
                <TableHead>Crédits</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <div>
                        <div>
                          {new Date(event.date).toLocaleDateString("fr-FR")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.time}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {event.currentParticipants}/{event.maxParticipants}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={event.isScheduled}
                      onCheckedChange={() => handleToggleScheduled(event.id)}
                    />
                  </TableCell>
                  <TableCell>{event.credits} pts</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewEventDetails?.(event.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
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
