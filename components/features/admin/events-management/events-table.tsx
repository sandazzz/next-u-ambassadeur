import { Event } from "@prisma/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventRow } from "./event-row";

export function EventsTable({ events }: { events: Event[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Événement</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Lieu</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
