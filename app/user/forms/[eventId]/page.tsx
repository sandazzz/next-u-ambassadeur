import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { RegisterForm } from "./register-form";

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const session = await auth();

  if (!session || session.user.role !== "ambassador") {
    redirect("/");
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
    <div className="w-full p-8 flex justify-center">
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-muted-foreground mt-2">{event.description}</p>
        </div>

        <RegisterForm event={event} />
      </div>
    </div>
  );
}
