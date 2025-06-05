import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RegisterForm } from "./register-form";
import { Event, EventSlot, UserSlot } from "@prisma/client";

type EventWithSlots = Event & {
  slots: (EventSlot & {
    userSlots: UserSlot[];
  })[];
};

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = await params;

  const session = await auth();

  if (!session || session.user.role !== "ambassador") {
    notFound();
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      slots: {
        include: {
          userSlots: true,
        },
      },
    },
  });

  if (!event || event.status !== "open") {
    notFound();
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-muted-foreground mt-2">{event.description}</p>
        </div>

        <RegisterForm event={event as EventWithSlots} />
      </div>
    </div>
  );
}
