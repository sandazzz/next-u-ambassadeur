import { Event } from "@prisma/client";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { EventActions } from "./EventActions";
import Link from "next/link";

type EventStatus = "open" | "closed" | "completed";

const getStatusBadge = (status: EventStatus) => {
  const variants = {
    open: "default",
    closed: "secondary",
    completed: "outline",
  } as const;

  const labels = {
    open: "Ouvert",
    closed: "Fermé",
    completed: "Terminé",
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
};

export function EventRow({ event }: { event: Event }) {
  return (
    <TableRow>
      <TableCell>
        <Link
          href={`/admin/events-management/${event.id}`}
          className="hover:underline"
        >
          <div>
            <div className="font-medium">{event.title}</div>
            <div className="text-sm text-muted-foreground">
              {event.description}
            </div>
          </div>
        </Link>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <div>
            <div>{new Date(event.date).toLocaleDateString("fr-FR")}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(event.date).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
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
      <TableCell>{getStatusBadge(event.status as EventStatus)}</TableCell>
      <TableCell>
        <EventActions event={event} />
      </TableCell>
    </TableRow>
  );
}
