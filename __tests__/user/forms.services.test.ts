import {
  registerToEventService,
  registerSchema,
} from "@/app/user/forms/[eventId]/services";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Mocks
jest.mock("@/lib/prisma", () => ({
  prisma: {
    event: {
      findUnique: jest.fn(),
    },
    userSlot: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));

// Casts
const mockPrisma = prisma as unknown as {
  event: {
    findUnique: jest.Mock;
  };
  userSlot: {
    findFirst: jest.Mock;
    create: jest.Mock;
  };
};

const mockAuth = auth as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("registerToEventService", () => {
  const validInput = {
    eventId: "event-1",
    slotIds: ["slot-1", "slot-2"],
  };

  const mockEvent = {
    id: "event-1",
    title: "Événement Test",
    status: "open",
    slots: [
      { id: "slot-1", startTime: new Date("2024-12-25T09:00") },
      { id: "slot-2", startTime: new Date("2024-12-25T14:00") },
      { id: "slot-3", startTime: new Date("2024-12-25T16:00") },
    ],
  };

  const mockSession = {
    user: {
      id: "user-1",
      role: "ambassador",
    },
  };

  describe("Inscription réussie", () => {
    it("inscrit un utilisateur à plusieurs plages horaires", async () => {
      const mockCreatedSlots = [
        {
          id: "userSlot-1",
          userId: "user-1",
          slotId: "slot-1",
          status: "waiting_list",
        },
        {
          id: "userSlot-2",
          userId: "user-1",
          slotId: "slot-2",
          status: "waiting_list",
        },
      ];

      mockAuth.mockResolvedValue(mockSession);
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.userSlot.findFirst.mockResolvedValue(null);
      mockPrisma.userSlot.create
        .mockResolvedValueOnce(mockCreatedSlots[0])
        .mockResolvedValueOnce(mockCreatedSlots[1]);

      const result = await registerToEventService(validInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
        where: { id: "event-1" },
        include: { slots: true },
      });
      expect(mockPrisma.userSlot.findFirst).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
          slot: { eventId: "event-1" },
        },
      });
      expect(mockPrisma.userSlot.create).toHaveBeenCalledTimes(2);
      expect(mockPrisma.userSlot.create).toHaveBeenNthCalledWith(1, {
        data: {
          userId: "user-1",
          slotId: "slot-1",
          status: "waiting_list",
        },
      });
      expect(mockPrisma.userSlot.create).toHaveBeenNthCalledWith(2, {
        data: {
          userId: "user-1",
          slotId: "slot-2",
          status: "waiting_list",
        },
      });
      expect(result).toEqual({ data: mockCreatedSlots });
    });

    it("inscrit un utilisateur à une seule plage horaire", async () => {
      const singleSlotInput = {
        eventId: "event-1",
        slotIds: ["slot-1"],
      };

      const mockCreatedSlot = {
        id: "userSlot-1",
        userId: "user-1",
        slotId: "slot-1",
        status: "waiting_list",
      };

      mockAuth.mockResolvedValue(mockSession);
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.userSlot.findFirst.mockResolvedValue(null);
      mockPrisma.userSlot.create.mockResolvedValue(mockCreatedSlot);

      const result = await registerToEventService(singleSlotInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.userSlot.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.userSlot.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          slotId: "slot-1",
          status: "waiting_list",
        },
      });
      expect(result).toEqual({ data: [mockCreatedSlot] });
    });
  });

  describe("Authentification", () => {
    it("refuse l'accès pour un utilisateur non connecté", async () => {
      mockAuth.mockResolvedValue(null);

      const result = await registerToEventService(validInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.event.findUnique).not.toHaveBeenCalled();
      expect(mockPrisma.userSlot.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.userSlot.create).not.toHaveBeenCalled();
      expect(result).toEqual({ error: { serverError: "Non autorisé" } });
    });

    it("refuse l'accès pour un utilisateur sans ID", async () => {
      const sessionWithoutId = {
        user: {
          role: "ambassador",
          // pas d'id
        },
      };

      mockAuth.mockResolvedValue(sessionWithoutId);

      const result = await registerToEventService(validInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.event.findUnique).not.toHaveBeenCalled();
      expect(mockPrisma.userSlot.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.userSlot.create).not.toHaveBeenCalled();
      expect(result).toEqual({ error: { serverError: "Non autorisé" } });
    });
  });

  describe("Validation des événements", () => {
    it("renvoie une erreur si l'événement n'existe pas", async () => {
      mockAuth.mockResolvedValue(mockSession);
      mockPrisma.event.findUnique.mockResolvedValue(null);

      const result = await registerToEventService(validInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
        where: { id: "event-1" },
        include: { slots: true },
      });
      expect(mockPrisma.userSlot.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.userSlot.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: { serverError: "Événement non trouvé" },
      });
    });

    it("renvoie une erreur si l'événement est fermé", async () => {
      const closedEvent = { ...mockEvent, status: "closed" };
      mockAuth.mockResolvedValue(mockSession);
      mockPrisma.event.findUnique.mockResolvedValue(closedEvent);

      const result = await registerToEventService(validInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.userSlot.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.userSlot.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: {
          serverError: "Les inscriptions sont fermées pour cet événement",
        },
      });
    });

    it("renvoie une erreur si l'événement est terminé", async () => {
      const completedEvent = { ...mockEvent, status: "completed" };
      mockAuth.mockResolvedValue(mockSession);
      mockPrisma.event.findUnique.mockResolvedValue(completedEvent);

      const result = await registerToEventService(validInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.userSlot.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.userSlot.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: {
          serverError: "Les inscriptions sont fermées pour cet événement",
        },
      });
    });
  });

  describe("Validation des inscriptions existantes", () => {
    it("renvoie une erreur si l'utilisateur est déjà inscrit", async () => {
      const existingRegistration = {
        id: "userSlot-existing",
        userId: "user-1",
        slotId: "slot-3",
        status: "waiting_list",
      };

      mockAuth.mockResolvedValue(mockSession);
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.userSlot.findFirst.mockResolvedValue(existingRegistration);

      const result = await registerToEventService(validInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.userSlot.findFirst).toHaveBeenCalledWith({
        where: {
          userId: "user-1",
          slot: { eventId: "event-1" },
        },
      });
      expect(mockPrisma.userSlot.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: {
          serverError:
            "Vous êtes déjà inscrit à une plage horaire de cet événement",
        },
      });
    });
  });

  describe("Validation des plages horaires", () => {
    it("renvoie une erreur si une plage horaire n'appartient pas à l'événement", async () => {
      const invalidInput = {
        eventId: "event-1",
        slotIds: ["slot-1", "invalid-slot"],
      };

      mockAuth.mockResolvedValue(mockSession);
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.userSlot.findFirst.mockResolvedValue(null);

      const result = await registerToEventService(invalidInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.userSlot.findFirst).toHaveBeenCalled();
      expect(mockPrisma.userSlot.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: {
          serverError:
            "Une des plages sélectionnées n'appartient pas à l'événement",
        },
      });
    });

    it("renvoie une erreur si toutes les plages horaires sont invalides", async () => {
      const invalidInput = {
        eventId: "event-1",
        slotIds: ["invalid-slot-1", "invalid-slot-2"],
      };

      mockAuth.mockResolvedValue(mockSession);
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.userSlot.findFirst.mockResolvedValue(null);

      const result = await registerToEventService(invalidInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.userSlot.findFirst).toHaveBeenCalled();
      expect(mockPrisma.userSlot.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: {
          serverError:
            "Une des plages sélectionnées n'appartient pas à l'événement",
        },
      });
    });
  });

  describe("Gestion des erreurs", () => {
    it("gère les erreurs d'authentification", async () => {
      const authError = new Error("Erreur d'authentification");
      mockAuth.mockRejectedValue(authError);

      const result = await registerToEventService(validInput);

      expect(result).toEqual({
        error: { serverError: "Une erreur est survenue lors de l'inscription" },
      });

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.event.findUnique).not.toHaveBeenCalled();
      expect(mockPrisma.userSlot.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.userSlot.create).not.toHaveBeenCalled();
    });

    it("gère les erreurs de base de données lors de la recherche d'événement", async () => {
      const error = new Error("Erreur de base de données");
      mockAuth.mockResolvedValue(mockSession);
      mockPrisma.event.findUnique.mockRejectedValue(error);

      const result = await registerToEventService(validInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.userSlot.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.userSlot.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        error: { serverError: "Une erreur est survenue lors de l'inscription" },
      });
    });

    it("gère les erreurs de base de données lors de la création des inscriptions", async () => {
      const error = new Error("Erreur de création");
      mockAuth.mockResolvedValue(mockSession);
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);
      mockPrisma.userSlot.findFirst.mockResolvedValue(null);
      mockPrisma.userSlot.create.mockRejectedValue(error);

      const result = await registerToEventService(validInput);

      expect(mockAuth).toHaveBeenCalled();
      expect(mockPrisma.userSlot.create).toHaveBeenCalled();
      expect(result).toEqual({
        error: { serverError: "Une erreur est survenue lors de l'inscription" },
      });
    });
  });
});

describe("registerSchema", () => {
  it("valide un input correct", () => {
    const validInput = {
      eventId: "event-1",
      slotIds: ["slot-1", "slot-2"],
    };

    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("valide un input avec une seule plage horaire", () => {
    const validInput = {
      eventId: "event-1",
      slotIds: ["slot-1"],
    };

    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejette un eventId vide", () => {
    const invalidInput = {
      eventId: "",
      slotIds: ["slot-1"],
    };

    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "L'identifiant de l'événement est requis"
      );
    }
  });

  it("rejette un tableau de slotIds vide", () => {
    const invalidInput = {
      eventId: "event-1",
      slotIds: [],
    };

    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Au moins une plage horaire doit être sélectionnée"
      );
    }
  });

  it("rejette un input sans eventId", () => {
    const invalidInput = {
      slotIds: ["slot-1"],
    };

    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("rejette un input sans slotIds", () => {
    const invalidInput = {
      eventId: "event-1",
    };

    const result = registerSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});
