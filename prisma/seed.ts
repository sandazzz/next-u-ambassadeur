import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const events = [
    {
      title: "Salon Aquitec",
      description: "Salon Aquitec",
      date: new Date("2024-10-12"),
      location: "Aquitec",
    },
    {
      title: "Salon Aquitec",
      description: "Salon Aquitec",
      date: new Date("2024-10-13"),
      location: "Aquitec",
    },
    {
      title: "JPO / Concours",
      description: "Journée Portes Ouvertes ou concours",
      date: new Date("2024-10-19"),
      location: "Campus",
    },
    {
      title: "JPO / Concours",
      description: "Journée Portes Ouvertes ou concours",
      date: new Date("2024-10-23"),
      location: "Campus",
    },
    {
      title: "Salon des grandes écoles",
      description: "Salon des grandes écoles",
      date: new Date("2024-11-16"),
      location: "L’Étudiant",
    },
    {
      title: "Salon des études supérieures",
      description: "Salon des études supérieures",
      date: new Date("2024-11-16"),
      location: "Studyrama",
    },
    {
      title: "Journée Portes Ouvertes",
      description: "Journée Portes Ouvertes",
      date: new Date("2024-11-23"),
      location: "Campus",
    },
    {
      title: "Concours NEXT",
      description: "Session du concours NEXT",
      date: new Date("2024-11-30"),
      location: "Campus",
    },
    {
      title: "JPO / Concours",
      description: "Journée Portes Ouvertes ou concours",
      date: new Date("2024-12-14"),
      location: "Campus",
    },
    {
      title: "Salon de l’Étudiant",
      description: "Salon de l’Étudiant",
      date: new Date("2025-01-10"),
      location: "L’Étudiant",
    },
    {
      title: "Salon de l’Étudiant",
      description: "Salon de l’Étudiant",
      date: new Date("2025-01-11"),
      location: "L’Étudiant",
    },
    {
      title: "Salon de l’Étudiant",
      description: "Salon de l’Étudiant",
      date: new Date("2025-01-12"),
      location: "L’Étudiant",
    },
    {
      title: "Salon Infosup",
      description: "Salon Infosup",
      date: new Date("2025-01-16"),
      location: "Infosup",
    },
    {
      title: "Salon Infosup",
      description: "Salon Infosup",
      date: new Date("2025-01-17"),
      location: "Infosup",
    },
    {
      title: "Journée Portes Ouvertes",
      description: "Journée Portes Ouvertes",
      date: new Date("2025-01-18"),
      location: "Campus",
    },
    {
      title: "JPO / Concours",
      description: "Journée Portes Ouvertes ou concours",
      date: new Date("2025-01-25"),
      location: "Campus",
    },
    {
      title: "Concours NEXT",
      description: "Session du concours NEXT",
      date: new Date("2025-02-05"),
      location: "Campus",
    },
    {
      title: "JPO / Concours",
      description: "Journée Portes Ouvertes ou concours",
      date: new Date("2025-02-15"),
      location: "Campus",
    },
    {
      title: "JPO / Concours",
      description: "Journée Portes Ouvertes ou concours",
      date: new Date("2025-03-22"),
      location: "Campus",
    },
    {
      title: "Concours NEXT",
      description: "Session du concours NEXT",
      date: new Date("2025-03-26"),
      location: "Campus",
    },
    {
      title: "JPO / Concours",
      description: "Journée Portes Ouvertes ou concours",
      date: new Date("2025-04-12"),
      location: "Campus",
    },
    {
      title: "Concours NEXT",
      description: "Session du concours NEXT",
      date: new Date("2025-05-14"),
      location: "Campus",
    },
    {
      title: "Concours NEXT",
      description: "Session du concours NEXT",
      date: new Date("2025-05-24"),
      location: "Campus",
    },
    {
      title: "JPO / Concours",
      description: "Journée Portes Ouvertes ou concours",
      date: new Date("2025-06-07"),
      location: "Campus",
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: {
        ...event,
        status: "closed",
      },
    });
  }
}

main()
  .then(() => {
    console.log("Events inserted");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
