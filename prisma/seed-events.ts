import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const events = [
  {
    id: "cmbf5fatr0000x5ts03ysh97r",
    date: "2024-10-12 00:00:00",
    createdAt: "2025-06-02 13:52:00.399",
    description: "Salon Aquitec",
    location: "Aquitec",
    status: "closed",
    title: "Salon Aquitec",
    updatedAt: "2025-06-03 06:32:54.84",
  },
  {
    id: "cmbf5fb0k0001x5tss0xgbyye",
    date: "2024-10-13 00:00:00",
    createdAt: "2025-06-02 13:52:00.644",
    description: "Salon Aquitec",
    location: "Aquitec",
    status: "closed",
    title: "Salon Aquitec",
    updatedAt: "2025-06-03 06:32:41.553",
  },
  {
    id: "cmbf5fb3z0002x5ts2luoq80p",
    date: "2024-10-19 00:00:00",
    createdAt: "2025-06-02 13:52:00.767",
    description: "Journée Portes Ouvertes ou concours",
    location: "Campus",
    status: "closed",
    title: "JPO / Concours",
    updatedAt: "2025-06-03 07:23:28.784",
  },
  {
    id: "cmbf5fb7g0003x5ts1xwc2es0",
    date: "2024-10-23 00:00:00",
    createdAt: "2025-06-02 13:52:00.892",
    description: "Journée Portes Ouvertes ou concours",
    location: "Campus",
    status: "closed",
    title: "JPO / Concours",
    updatedAt: "2025-06-03 07:23:32.904",
  },
  {
    id: "cmbf5fbbv0004x5ts7fx2fsxc",
    date: "2024-11-16 00:00:00",
    createdAt: "2025-06-02 13:52:01.052",
    description: "Salon des grandes écoles",
    location: "L'Étudiant",
    status: "closed",
    title: "Salon des grandes écoles",
    updatedAt: "2025-06-03 07:23:36.655",
  },
  {
    id: "cmbf5fbff0005x5ts2rv3796v",
    date: "2024-11-16 00:00:00",
    createdAt: "2025-06-02 13:52:01.18",
    description: "Salon des études supérieures",
    location: "Studyrama",
    status: "closed",
    title: "Salon des études supérieures",
    updatedAt: "2025-06-03 07:24:26.023",
  },
  {
    id: "cmbf5fbiw0006x5tst1zjppom",
    date: "2024-11-23 00:00:00",
    createdAt: "2025-06-02 13:52:01.305",
    description: "Journée Portes Ouvertes",
    location: "Campus",
    status: "closed",
    title: "Journée Portes Ouvertes",
    updatedAt: "2025-06-03 07:23:42.228",
  },
  {
    id: "cmbf5fbmd0007x5tsfpoo4zvx",
    date: "2024-11-30 00:00:00",
    createdAt: "2025-06-02 13:52:01.43",
    description: "Session du concours NEXT",
    location: "Campus",
    status: "closed",
    title: "Concours NEXT",
    updatedAt: "2025-06-03 07:23:44.26",
  },
  {
    id: "cmbf5fbpu0008x5tslwzoaezq",
    date: "2024-12-14 00:00:00",
    createdAt: "2025-06-02 13:52:01.555",
    description: "Journée Portes Ouvertes ou concours",
    location: "Campus",
    status: "closed",
    title: "JPO / Concours",
    updatedAt: "2025-06-03 07:23:46.187",
  },
  {
    id: "cmbf5fbtb0009x5tscpps4q20",
    date: "2025-01-10 00:00:00",
    createdAt: "2025-06-02 13:52:01.68",
    description: "Salon de l'Étudiant",
    location: "L'Étudiant",
    status: "closed",
    title: "Salon de l'Étudiant",
    updatedAt: "2025-06-03 07:23:50.132",
  },
  {
    id: "cmbf5fbwr000ax5tskyatr4vw",
    date: "2025-01-11 00:00:00",
    createdAt: "2025-06-02 13:52:01.803",
    description: "Salon de l'Étudiant",
    location: "L'Étudiant",
    status: "closed",
    title: "Salon de l'Étudiant",
    updatedAt: "2025-06-03 07:23:48.028",
  },
  {
    id: "cmbf5fc04000bx5ts4daynn6f",
    date: "2025-01-12 00:00:00",
    createdAt: "2025-06-02 13:52:01.924",
    description: "Salon de l'Étudiant",
    location: "L'Étudiant",
    status: "closed",
    title: "Salon de l'Étudiant",
    updatedAt: "2025-06-02 13:52:01.924",
  },
  {
    id: "cmbf5fc3n000cx5tsfvl4rwpf",
    date: "2025-01-16 00:00:00",
    createdAt: "2025-06-02 13:52:02.051",
    description: "Salon Infosup",
    location: "Infosup",
    status: "closed",
    title: "Salon Infosup",
    updatedAt: "2025-06-03 07:23:52.645",
  },
  {
    id: "cmbf5fc71000dx5tspdp7yt35",
    date: "2025-01-17 00:00:00",
    createdAt: "2025-06-02 13:52:02.173",
    description: "Salon Infosup",
    location: "Infosup",
    status: "closed",
    title: "Salon Infosup",
    updatedAt: "2025-06-02 13:52:02.173",
  },
  {
    id: "cmbf5fcaf000ex5tsxcpd9ugk",
    date: "2025-01-18 00:00:00",
    createdAt: "2025-06-02 13:52:02.296",
    description: "Journée Portes Ouvertes",
    location: "Campus",
    status: "closed",
    title: "Journée Portes Ouvertes",
    updatedAt: "2025-06-02 13:52:02.296",
  },
  {
    id: "cmbf5fcdv000fx5ts11tpabii",
    date: "2025-01-25 00:00:00",
    createdAt: "2025-06-02 13:52:02.42",
    description: "Journée Portes Ouvertes ou concours",
    location: "Campus",
    status: "closed",
    title: "JPO / Concours",
    updatedAt: "2025-06-02 13:52:02.42",
  },
  {
    id: "cmbf5fche000gx5tsi1zt56kv",
    date: "2025-02-05 00:00:00",
    createdAt: "2025-06-02 13:52:02.546",
    description: "Session du concours NEXT",
    location: "Campus",
    status: "closed",
    title: "Concours NEXT",
    updatedAt: "2025-06-02 13:52:02.546",
  },
  {
    id: "cmbf5fckv000hx5ts6bekzw44",
    date: "2025-02-15 00:00:00",
    createdAt: "2025-06-02 13:52:02.671",
    description: "Journée Portes Ouvertes ou concours",
    location: "Campus",
    status: "closed",
    title: "JPO / Concours",
    updatedAt: "2025-06-02 13:52:02.671",
  },
  {
    id: "cmbf5fcoa000ix5tsfzd9v6fe",
    date: "2025-03-22 00:00:00",
    createdAt: "2025-06-02 13:52:02.794",
    description: "Journée Portes Ouvertes ou concours",
    location: "Campus",
    status: "open",
    title: "JPO / Concours",
    updatedAt: "2025-07-06 13:39:51.541",
  },
];

// Configuration des plages horaires par type d'événement
const getTimeSlotsForEvent = (eventTitle: string) => {
  // Plages horaires par défaut pour tous les événements
  const defaultSlots = [
    { startTime: "09:00", endTime: "12:00" },
    { startTime: "14:00", endTime: "17:00" },
  ];

  // Plages horaires spécifiques selon le type d'événement
  if (eventTitle.includes("Salon")) {
    return [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "14:00", endTime: "18:00" },
    ];
  }

  if (eventTitle.includes("JPO") || eventTitle.includes("Portes Ouvertes")) {
    return [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "14:00", endTime: "16:00" },
    ];
  }

  if (eventTitle.includes("Concours")) {
    return [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "13:00", endTime: "16:00" },
    ];
  }

  return defaultSlots;
};

async function main() {
  console.log("🌱 Début du seeding des événements...");

  for (const eventData of events) {
    try {
      // Vérifier si l'événement existe déjà
      const existingEvent = await prisma.event.findUnique({
        where: { id: eventData.id },
      });

      if (existingEvent) {
        console.log(
          `⚠️  L'événement "${eventData.title}" existe déjà, ignoré.`
        );
        continue;
      }

      // Créer l'événement
      const event = await prisma.event.create({
        data: {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          date: new Date(eventData.date),
          location: eventData.location,
          status: eventData.status,
          createdAt: new Date(eventData.createdAt),
          updatedAt: new Date(eventData.updatedAt),
        },
      });

      // Créer les plages horaires pour cet événement
      const timeSlots = getTimeSlotsForEvent(eventData.title);

      for (const slot of timeSlots) {
        await prisma.eventSlot.create({
          data: {
            eventId: event.id,
            startTime: new Date(
              `${eventData.date.split(" ")[0]}T${slot.startTime}`
            ),
            endTime: new Date(
              `${eventData.date.split(" ")[0]}T${slot.endTime}`
            ),
          },
        });
      }

      console.log(
        `✅ Événement "${eventData.title}" créé avec ${timeSlots.length} plage(s) horaire(s)`
      );
    } catch (error) {
      console.error(
        `❌ Erreur lors de la création de l'événement "${eventData.title}":`,
        error
      );
    }
  }

  console.log("🎉 Seeding des événements terminé !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
