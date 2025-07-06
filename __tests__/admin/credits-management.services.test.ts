import {
  adjustCreditsService,
  adjustCreditsSchema,
} from "@/app/admin/credits-management/services";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Mocks
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth", () => ({
  checkAdminAccess: jest.fn(),
}));

// Casts
const mockPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
  };
};

const mockCheckAccess = checkAdminAccess as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockCheckAccess.mockResolvedValue(undefined);
  mockRevalidatePath.mockResolvedValue(undefined);
});

describe("adjustCreditsService", () => {
  describe("Ajout de crédits", () => {
    it("ajoute un crédit à un utilisateur avec des crédits existants", async () => {
      const mockUser = {
        id: "user-1",
        name: "Alice",
        credit: 5,
      };

      const updatedUser = {
        ...mockUser,
        credit: 6,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await adjustCreditsService({
        userId: "user-1",
        type: "add",
      });

      expect(mockCheckAccess).toHaveBeenCalled();
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-1" },
      });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { credit: 6 },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith(
        "/admin/credits-management"
      );
      expect(result).toEqual({ data: updatedUser });
    });

    it("ajoute un crédit à un utilisateur sans crédits (credit: null)", async () => {
      const mockUser = {
        id: "user-1",
        name: "Bob",
        credit: null,
      };

      const updatedUser = {
        ...mockUser,
        credit: 1,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await adjustCreditsService({
        userId: "user-1",
        type: "add",
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { credit: 1 },
      });
      expect(result).toEqual({ data: updatedUser });
    });

    it("ajoute un crédit à un utilisateur avec 0 crédit", async () => {
      const mockUser = {
        id: "user-1",
        name: "Charlie",
        credit: 0,
      };

      const updatedUser = {
        ...mockUser,
        credit: 1,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await adjustCreditsService({
        userId: "user-1",
        type: "add",
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { credit: 1 },
      });
      expect(result).toEqual({ data: updatedUser });
    });
  });

  describe("Retrait de crédits", () => {
    it("retire un crédit à un utilisateur avec plusieurs crédits", async () => {
      const mockUser = {
        id: "user-1",
        name: "David",
        credit: 10,
      };

      const updatedUser = {
        ...mockUser,
        credit: 9,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await adjustCreditsService({
        userId: "user-1",
        type: "remove",
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { credit: 9 },
      });
      expect(result).toEqual({ data: updatedUser });
    });

    it("retire un crédit à un utilisateur avec 1 crédit (résultat: 0)", async () => {
      const mockUser = {
        id: "user-1",
        name: "Eve",
        credit: 1,
      };

      const updatedUser = {
        ...mockUser,
        credit: 0,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await adjustCreditsService({
        userId: "user-1",
        type: "remove",
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { credit: 0 },
      });
      expect(result).toEqual({ data: updatedUser });
    });

    it("retire un crédit à un utilisateur avec 0 crédit (reste à 0)", async () => {
      const mockUser = {
        id: "user-1",
        name: "Frank",
        credit: 0,
      };

      const updatedUser = {
        ...mockUser,
        credit: 0,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await adjustCreditsService({
        userId: "user-1",
        type: "remove",
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { credit: 0 },
      });
      expect(result).toEqual({ data: updatedUser });
    });

    it("retire un crédit à un utilisateur sans crédits (credit: null)", async () => {
      const mockUser = {
        id: "user-1",
        name: "Grace",
        credit: null,
      };

      const updatedUser = {
        ...mockUser,
        credit: 0,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await adjustCreditsService({
        userId: "user-1",
        type: "remove",
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { credit: 0 },
      });
      expect(result).toEqual({ data: updatedUser });
    });
  });

  describe("Gestion des erreurs", () => {
    it("renvoie une erreur si l'utilisateur n'existe pas", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await adjustCreditsService({
        userId: "user-inexistant",
        type: "add",
      });

      expect(mockCheckAccess).toHaveBeenCalled();
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-inexistant" },
      });
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
      expect(result).toEqual({ serverError: "Utilisateur non trouvé" });
    });

    it("gère les erreurs de base de données lors de la recherche", async () => {
      const error = new Error("Erreur de base de données");
      mockPrisma.user.findUnique.mockRejectedValue(error);

      const result = await adjustCreditsService({
        userId: "user-1",
        type: "add",
      });

      expect(mockCheckAccess).toHaveBeenCalled();
      expect(result).toEqual({
        serverError: "Erreur lors de l'ajustement des crédits",
      });
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("gère les erreurs de base de données lors de la mise à jour", async () => {
      const mockUser = {
        id: "user-1",
        name: "Alice",
        credit: 5,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const error = new Error("Erreur de mise à jour");
      mockPrisma.user.update.mockRejectedValue(error);

      const result = await adjustCreditsService({
        userId: "user-1",
        type: "add",
      });

      expect(mockCheckAccess).toHaveBeenCalled();
      expect(result).toEqual({
        serverError: "Erreur lors de l'ajustement des crédits",
      });
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("lance une erreur si l'accès admin est refusé", async () => {
      mockCheckAccess.mockRejectedValue(new Error("Accès refusé"));

      await expect(
        adjustCreditsService({
          userId: "user-1",
          type: "add",
        })
      ).rejects.toThrow("Accès refusé");
    });
  });
});

describe("adjustCreditsSchema", () => {
  it("valide un input correct pour l'ajout", () => {
    const validInput = {
      userId: "user-1",
      type: "add" as const,
    };

    const result = adjustCreditsSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("valide un input correct pour le retrait", () => {
    const validInput = {
      userId: "user-1",
      type: "remove" as const,
    };

    const result = adjustCreditsSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("rejette un userId vide", () => {
    const invalidInput = {
      userId: "",
      type: "add" as const,
    };

    const result = adjustCreditsSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("rejette un type invalide", () => {
    const invalidInput = {
      userId: "user-1",
      type: "invalid" as "add" | "remove",
    };

    const result = adjustCreditsSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("rejette un input sans userId", () => {
    const invalidInput = {
      type: "add" as const,
    };

    const result = adjustCreditsSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("rejette un input sans type", () => {
    const invalidInput = {
      userId: "user-1",
    };

    const result = adjustCreditsSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});
