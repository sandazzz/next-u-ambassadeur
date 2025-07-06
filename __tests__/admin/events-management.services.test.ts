import {
  createEventService,
  updateEventService,
  deleteEventService,
  updateEventStatusService,
  createEventSchema,
  updateEventSchema,
  deleteEventSchema,
  updateEventStatusSchema,
} from "@/app/admin/events-management/services";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Mocks
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    eventSlot: {
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth", () => ({
  checkAdminAccess: jest.fn(),
}));

// Casts
const mockPrisma = prisma as unknown as {
  event: {
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  eventSlot: {
    deleteMany: jest.Mock;
  };
};

const mockCheckAccess = checkAdminAccess as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockCheckAccess.mockResolvedValue(undefined);
  mockRevalidatePath.mockResolvedValue(undefined);
});

describe("createEventService", () => {
  const validInput = {
    title: "Événement Test",
    description: "Description de l'événement test",
    date: "2024-12-25",
    timeSlots: [
      { startTime: "09:00", endTime: "10:00" },
      { startTime: "14:00", endTime: "15:00" },
    ],
    location: "Salle de conférence",
  };

  it("crée un événement avec succès", async () => {
    const mockEvent = {
      id: "event-1",
      title: "Événement Test",
      status: "closed",
    };

    mockPrisma.event.create.mockResolvedValue(mockEvent);

    const result = await createEventService(validInput);

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(mockPrisma.event.create).toHaveBeenCalledWith({
      data: {
        title: "Événement Test",
        description: "Description de l'événement test",
        date: new Date("2024-12-25"),
        location: "Salle de conférence",
        status: "closed",
        slots: {
          create: [
            {
              startTime: new Date("2024-12-25T09:00"),
              endTime: new Date("2024-12-25T10:00"),
            },
            {
              startTime: new Date("2024-12-25T14:00"),
              endTime: new Date("2024-12-25T15:00"),
            },
          ],
        },
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/events-management");
    expect(result).toBeUndefined();
  });

  it("gère les erreurs de création", async () => {
    const error = new Error("Erreur de base de données");
    mockPrisma.event.create.mockRejectedValue(error);

    const result = await createEventService(validInput);

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(result).toEqual({
      serverError: "Erreur lors de la création de l'événement",
    });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("lance une erreur si l'accès admin est refusé", async () => {
    mockCheckAccess.mockRejectedValue(new Error("Accès refusé"));

    await expect(createEventService(validInput)).rejects.toThrow(
      "Accès refusé"
    );
  });
});

describe("updateEventService", () => {
  const validInput = {
    id: "event-1",
    title: "Événement Modifié",
    description: "Description modifiée",
    date: "2024-12-26",
    timeSlots: [
      { startTime: "10:00", endTime: "11:00" },
      { startTime: "15:00", endTime: "16:00" },
    ],
    location: "Nouveau lieu",
  };

  it("met à jour un événement avec succès", async () => {
    const mockEvent = {
      id: "event-1",
      title: "Événement Modifié",
      slots: [
        { id: "slot-1", startTime: new Date("2024-12-26T10:00") },
        { id: "slot-2", startTime: new Date("2024-12-26T15:00") },
      ],
    };

    mockPrisma.eventSlot.deleteMany.mockResolvedValue({});
    mockPrisma.event.update.mockResolvedValue(mockEvent);

    const result = await updateEventService(validInput);

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(mockPrisma.eventSlot.deleteMany).toHaveBeenCalledWith({
      where: { eventId: "event-1" },
    });
    expect(mockPrisma.event.update).toHaveBeenCalledWith({
      where: { id: "event-1" },
      data: {
        title: "Événement Modifié",
        description: "Description modifiée",
        date: new Date("2024-12-26"),
        location: "Nouveau lieu",
        slots: {
          create: [
            {
              startTime: new Date("2024-12-26T10:00"),
              endTime: new Date("2024-12-26T11:00"),
            },
            {
              startTime: new Date("2024-12-26T15:00"),
              endTime: new Date("2024-12-26T16:00"),
            },
          ],
        },
      },
      include: {
        slots: true,
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/events-management");
    expect(result).toEqual({ data: mockEvent });
  });

  it("gère les erreurs de mise à jour", async () => {
    const error = new Error("Erreur de mise à jour");
    mockPrisma.event.update.mockRejectedValue(error);

    const result = await updateEventService(validInput);

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(result).toEqual({
      serverError: "Erreur lors de la mise à jour de l'événement",
    });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("lance une erreur si l'accès admin est refusé", async () => {
    mockCheckAccess.mockRejectedValue(new Error("Accès refusé"));

    await expect(updateEventService(validInput)).rejects.toThrow(
      "Accès refusé"
    );
  });
});

describe("deleteEventService", () => {
  const validInput = { id: "event-1" };

  it("supprime un événement avec succès", async () => {
    mockPrisma.event.delete.mockResolvedValue({});

    const result = await deleteEventService(validInput);

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(mockPrisma.event.delete).toHaveBeenCalledWith({
      where: { id: "event-1" },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/events-management");
    expect(result).toEqual({ data: { success: true } });
  });

  it("gère les erreurs de suppression", async () => {
    const error = new Error("Erreur de suppression");
    mockPrisma.event.delete.mockRejectedValue(error);

    const result = await deleteEventService(validInput);

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(result).toEqual({
      serverError: "Erreur lors de la suppression de l'événement",
    });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("lance une erreur si l'accès admin est refusé", async () => {
    mockCheckAccess.mockRejectedValue(new Error("Accès refusé"));

    await expect(deleteEventService(validInput)).rejects.toThrow(
      "Accès refusé"
    );
  });
});

describe("updateEventStatusService", () => {
  const validInput = { id: "event-1", status: "open" as const };

  it("met à jour le statut d'un événement avec succès", async () => {
    const mockEvent = {
      id: "event-1",
      title: "Événement Test",
      status: "open",
    };

    mockPrisma.event.update.mockResolvedValue(mockEvent);

    const result = await updateEventStatusService(validInput);

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(mockPrisma.event.update).toHaveBeenCalledWith({
      where: { id: "event-1" },
      data: { status: "open" },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin/events-management");
    expect(result).toEqual({ data: mockEvent });
  });

  it("met à jour le statut vers 'closed'", async () => {
    const mockEvent = {
      id: "event-1",
      status: "closed",
    };

    mockPrisma.event.update.mockResolvedValue(mockEvent);

    const result = await updateEventStatusService({
      id: "event-1",
      status: "closed",
    });

    expect(mockPrisma.event.update).toHaveBeenCalledWith({
      where: { id: "event-1" },
      data: { status: "closed" },
    });
    expect(result).toEqual({ data: mockEvent });
  });

  it("met à jour le statut vers 'completed'", async () => {
    const mockEvent = {
      id: "event-1",
      status: "completed",
    };

    mockPrisma.event.update.mockResolvedValue(mockEvent);

    const result = await updateEventStatusService({
      id: "event-1",
      status: "completed",
    });

    expect(mockPrisma.event.update).toHaveBeenCalledWith({
      where: { id: "event-1" },
      data: { status: "completed" },
    });
    expect(result).toEqual({ data: mockEvent });
  });

  it("gère les erreurs de mise à jour du statut", async () => {
    const error = new Error("Erreur de mise à jour du statut");
    mockPrisma.event.update.mockRejectedValue(error);

    const result = await updateEventStatusService(validInput);

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(result).toEqual({
      serverError: "Erreur lors de la mise à jour du statut",
    });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("lance une erreur si l'accès admin est refusé", async () => {
    mockCheckAccess.mockRejectedValue(new Error("Accès refusé"));

    await expect(updateEventStatusService(validInput)).rejects.toThrow(
      "Accès refusé"
    );
  });
});

describe("Schémas de validation", () => {
  describe("createEventSchema", () => {
    it("valide un input correct", () => {
      const validInput = {
        title: "Événement Test",
        description: "Description",
        date: "2024-12-25",
        location: "Lieu",
        timeSlots: [{ startTime: "09:00", endTime: "10:00" }],
      };

      const result = createEventSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("rejette un titre vide", () => {
      const invalidInput = {
        title: "",
        description: "Description",
        date: "2024-12-25",
        location: "Lieu",
        timeSlots: [{ startTime: "09:00", endTime: "10:00" }],
      };

      const result = createEventSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Le titre est requis");
      }
    });

    it("rejette un tableau de timeSlots vide", () => {
      const invalidInput = {
        title: "Événement Test",
        description: "Description",
        date: "2024-12-25",
        location: "Lieu",
        timeSlots: [],
      };

      const result = createEventSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Au moins une plage horaire est requise"
        );
      }
    });
  });

  describe("updateEventStatusSchema", () => {
    it("valide tous les statuts possibles", () => {
      const validStatuses = ["open", "closed", "completed"];

      validStatuses.forEach((status) => {
        const input = { id: "event-1", status: status as any };
        const result = updateEventStatusSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });

    it("rejette un statut invalide", () => {
      const invalidInput = { id: "event-1", status: "invalid" };

      const result = updateEventStatusSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
