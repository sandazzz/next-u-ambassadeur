import {
  updateProfileService,
  updateProfileSchema,
} from "@/app/user/profile/services";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

// Mocks
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));

// Casts
const mockPrisma = prisma as unknown as {
  user: {
    update: jest.Mock;
  };
};

const mockRevalidatePath = revalidatePath as jest.Mock;
const mockAuth = auth as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockRevalidatePath.mockResolvedValue(undefined);
});

describe("updateProfileService", () => {
  const validInput = {
    name: "Alice Dupont",
    description: "Étudiante passionnée",
    school: "École Supérieure",
    promoYear: "2025",
    instagram: "@alice_dupont",
    phone: "0123456789",
    favoriteMoment: "Mon premier événement Next-u",
  };

  const mockSession = {
    user: {
      id: "user-1",
      role: "ambassador",
    },
  };

  it("met à jour le profil avec succès", async () => {
    const mockUpdatedUser = {
      id: "user-1",
      name: "Alice Dupont",
      description: "Étudiante passionnée",
      school: "École Supérieure",
      promoYear: 2025,
      instagram: "@alice_dupont",
      phone: "0123456789",
      favoriteMoment: "Mon premier événement Next-u",
    };

    mockAuth.mockResolvedValue(mockSession);
    mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

    const result = await updateProfileService(validInput);

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        name: "Alice Dupont",
        description: "Étudiante passionnée",
        school: "École Supérieure",
        promoYear: 2025,
        instagram: "@alice_dupont",
        phone: "0123456789",
        favoriteMoment: "Mon premier événement Next-u",
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/user/profile");
    expect(result).toEqual({ data: mockUpdatedUser });
  });

  it("met à jour le profil avec des champs optionnels vides", async () => {
    const inputWithOptionalFields = {
      name: "Bob Martin",
      school: "Autre École",
      promoYear: "2024",
    };

    const mockUpdatedUser = {
      id: "user-1",
      name: "Bob Martin",
      description: null,
      school: "Autre École",
      promoYear: 2024,
      instagram: null,
      phone: null,
      favoriteMoment: null,
    };

    mockAuth.mockResolvedValue(mockSession);
    mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

    const result = await updateProfileService(inputWithOptionalFields);

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        name: "Bob Martin",
        description: undefined,
        school: "Autre École",
        promoYear: 2024,
        instagram: undefined,
        phone: undefined,
        favoriteMoment: undefined,
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/user/profile");
    expect(result).toEqual({ data: mockUpdatedUser });
  });

  it("convertit correctement promoYear en nombre", async () => {
    const inputWithStringYear = {
      name: "Charlie Wilson",
      school: "École Test",
      promoYear: "2026",
    };

    const mockUpdatedUser = {
      id: "user-1",
      name: "Charlie Wilson",
      promoYear: 2026,
    };

    mockAuth.mockResolvedValue(mockSession);
    mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

    await updateProfileService(inputWithStringYear);

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        name: "Charlie Wilson",
        description: undefined,
        school: "École Test",
        promoYear: 2026,
        instagram: undefined,
        phone: undefined,
        favoriteMoment: undefined,
      },
    });
  });

  it("refuse l'accès pour un utilisateur non connecté", async () => {
    mockAuth.mockResolvedValue(null);

    const result = await updateProfileService(validInput);

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual({ serverError: "Non autorisé" });
  });

  it("refuse l'accès pour un utilisateur avec un rôle différent d'ambassadeur", async () => {
    const adminSession = {
      user: {
        id: "user-1",
        role: "admin",
      },
    };

    mockAuth.mockResolvedValue(adminSession);

    const result = await updateProfileService(validInput);

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual({ serverError: "Non autorisé" });
  });

  it("refuse l'accès pour un utilisateur sans rôle", async () => {
    const sessionWithoutRole = {
      user: {
        id: "user-1",
        // pas de rôle
      },
    };

    mockAuth.mockResolvedValue(sessionWithoutRole);

    const result = await updateProfileService(validInput);

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual({ serverError: "Non autorisé" });
  });

  it("gère les erreurs de base de données", async () => {
    const error = new Error("Erreur de base de données");
    mockAuth.mockResolvedValue(mockSession);
    mockPrisma.user.update.mockRejectedValue(error);

    const result = await updateProfileService(validInput);

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPrisma.user.update).toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
    expect(result).toEqual({
      serverError: "Erreur lors de la mise à jour du profil",
    });
  });

  it("gère les erreurs de revalidation", async () => {
    const mockUpdatedUser = {
      id: "user-1",
      name: "Alice Dupont",
    };

    mockAuth.mockResolvedValue(mockSession);
    mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);
    mockRevalidatePath.mockRejectedValue(new Error("Erreur de revalidation"));

    const result = await updateProfileService(validInput);

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPrisma.user.update).toHaveBeenCalled();
    expect(mockRevalidatePath).toHaveBeenCalledWith("/user/profile");
    expect(result).toEqual({
      serverError: "Erreur lors de la mise à jour du profil",
    });
  });

  it("gère les erreurs d'authentification", async () => {
    const authError = new Error("Erreur d'authentification");
    mockAuth.mockRejectedValue(authError);

    const result = await updateProfileService(validInput);

    expect(result).toEqual({
      serverError: "Erreur lors de la mise à jour du profil",
    });

    expect(mockAuth).toHaveBeenCalled();
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});

describe("updateProfileSchema", () => {
  it("valide un input complet", () => {
    const validInput = {
      name: "Alice Dupont",
      description: "Étudiante passionnée",
      school: "École Supérieure",
      promoYear: "2025",
      instagram: "@alice_dupont",
      phone: "0123456789",
      favoriteMoment: "Mon premier événement Next-u",
    };

    const result = updateProfileSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("valide un input minimal", () => {
    const minimalInput = {
      name: "Bob Martin",
      school: "École Test",
      promoYear: "2024",
    };

    const result = updateProfileSchema.safeParse(minimalInput);
    expect(result.success).toBe(true);
  });

  it("rejette un nom vide", () => {
    const invalidInput = {
      name: "",
      school: "École Test",
      promoYear: "2024",
    };

    const result = updateProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Le nom est requis");
    }
  });

  it("rejette une école vide", () => {
    const invalidInput = {
      name: "Alice Dupont",
      school: "",
      promoYear: "2024",
    };

    const result = updateProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'école est requise");
    }
  });

  it("rejette une année de promotion vide", () => {
    const invalidInput = {
      name: "Alice Dupont",
      school: "École Test",
      promoYear: "",
    };

    const result = updateProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "L'année de promotion est requise"
      );
    }
  });

  it("rejette un input sans nom", () => {
    const invalidInput = {
      school: "École Test",
      promoYear: "2024",
    };

    const result = updateProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("rejette un input sans école", () => {
    const invalidInput = {
      name: "Alice Dupont",
      promoYear: "2024",
    };

    const result = updateProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("rejette un input sans année de promotion", () => {
    const invalidInput = {
      name: "Alice Dupont",
      school: "École Test",
    };

    const result = updateProfileSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });

  it("accepte des champs optionnels vides", () => {
    const inputWithEmptyOptionals = {
      name: "Alice Dupont",
      description: "",
      school: "École Test",
      promoYear: "2024",
      instagram: "",
      phone: "",
      favoriteMoment: "",
    };

    const result = updateProfileSchema.safeParse(inputWithEmptyOptionals);
    expect(result.success).toBe(true);
  });
});
