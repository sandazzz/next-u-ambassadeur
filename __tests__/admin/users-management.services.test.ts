import {
  createUserService,
  deleteUserService,
  updateUserService,
  deleteInvitedUserService,
  updateUserSchema,
} from "@/app/admin/(users-management)/services";
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
    whitelistEmail: {
      findUnique: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth", () => ({
  checkAdminAccess: jest.fn(),
}));

// Casts
const mockPrisma = prisma as unknown as {
  whitelistEmail: {
    findUnique: jest.Mock;
    create: jest.Mock;
    deleteMany: jest.Mock;
    delete: jest.Mock;
  };
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

const mockCheckAccess = checkAdminAccess as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockCheckAccess.mockResolvedValue(undefined);
  mockRevalidatePath.mockResolvedValue(undefined);
});

describe("createUserService", () => {
  it("refuse un email déjà utilisé", async () => {
    mockPrisma.whitelistEmail.findUnique.mockResolvedValue({
      email: "test@next-u.fr",
    });

    const result = await createUserService({
      name: "Alice",
      email: "test@next-u.fr",
      role: "admin",
    });

    expect(result).toEqual({ error: "Cet email est déjà utilisé" });
    expect(mockCheckAccess).toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("crée un utilisateur s'il est nouveau", async () => {
    const mockUser = { id: "123", email: "alice@next-u.fr" };
    mockPrisma.whitelistEmail.findUnique.mockResolvedValue(null);
    mockPrisma.whitelistEmail.create.mockResolvedValue(mockUser);

    const result = await createUserService({
      name: "Alice",
      email: "alice@next-u.fr",
      role: "admin",
    });

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(mockPrisma.whitelistEmail.create).toHaveBeenCalledWith({
      data: { email: "alice@next-u.fr" },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
    expect(result).toEqual({ data: mockUser });
  });

  it("lance une erreur si l'accès admin est refusé", async () => {
    mockCheckAccess.mockRejectedValue(new Error("Accès refusé"));

    await expect(
      createUserService({
        name: "Alice",
        email: "alice@next-u.fr",
        role: "admin",
      })
    ).rejects.toThrow("Accès refusé");
  });
});

describe("updateUserService", () => {
  it("renvoie une erreur si l'utilisateur n'existe pas", async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);

    const result = await updateUserService({
      id: "u1",
      name: "Alice",
      email: "alice@next-u.fr",
      role: "admin",
    });

    expect(result).toEqual({ error: "Utilisateur non trouvé" });
    expect(mockCheckAccess).toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("renvoie une erreur si l'email est déjà utilisé", async () => {
    mockPrisma.user.findUnique
      .mockResolvedValueOnce({ id: "u1", email: "old@next-u.fr" }) // 1er appel : user existant
      .mockResolvedValueOnce({ id: "u2", email: "alice@next-u.fr" }); // 2e appel : email pris

    const result = await updateUserService({
      id: "u1",
      name: "Alice",
      email: "alice@next-u.fr",
      role: "admin",
    });

    expect(result).toEqual({ error: "Cet email est déjà utilisé" });
    expect(mockCheckAccess).toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("met à jour l'utilisateur s'il est valide", async () => {
    mockPrisma.user.findUnique
      .mockResolvedValueOnce({ id: "u1", email: "old@next-u.fr" }) // user existant
      .mockResolvedValueOnce(null); // email libre

    const updatedUser: z.infer<typeof updateUserSchema> = {
      id: "u1",
      name: "Alice",
      email: "alice@next-u.fr",
      role: "admin",
    };

    mockPrisma.user.update.mockResolvedValue(updatedUser);

    const result = await updateUserService(updatedUser);

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(result).toEqual({ data: updatedUser });
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: {
        name: "Alice",
        email: "alice@next-u.fr",
        role: "admin",
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
  });

  it("met à jour l'utilisateur sans changer l'email", async () => {
    const existingUser = { id: "u1", email: "alice@next-u.fr" };
    mockPrisma.user.findUnique.mockResolvedValueOnce(existingUser);

    const updatedUser: z.infer<typeof updateUserSchema> = {
      id: "u1",
      name: "Alice Updated",
      email: "alice@next-u.fr", // même email
      role: "ambassador",
    };

    mockPrisma.user.update.mockResolvedValue(updatedUser);

    const result = await updateUserService(updatedUser);

    expect(result).toEqual({ data: updatedUser });
    expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1); // pas de vérification d'email
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: {
        name: "Alice Updated",
        email: "alice@next-u.fr",
        role: "ambassador",
      },
    });
  });

  it("lance une erreur si l'accès admin est refusé", async () => {
    mockCheckAccess.mockRejectedValue(new Error("Accès refusé"));

    await expect(
      updateUserService({
        id: "u1",
        name: "Alice",
        email: "alice@next-u.fr",
        role: "admin",
      })
    ).rejects.toThrow("Accès refusé");
  });
});

describe("deleteUserService", () => {
  it("renvoie une erreur si l'utilisateur n'existe pas", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const result = await deleteUserService({ id: "u1" });

    expect(result).toEqual({ error: "Utilisateur non trouvé" });
    expect(mockCheckAccess).toHaveBeenCalled();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it("supprime l'utilisateur et sa whitelist", async () => {
    const user = { id: "u1", email: "alice@next-u.fr" };
    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockPrisma.user.delete.mockResolvedValue({});
    mockPrisma.whitelistEmail.deleteMany.mockResolvedValue({});

    const result = await deleteUserService({ id: "u1" });

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(mockPrisma.user.delete).toHaveBeenCalledWith({
      where: { id: "u1" },
    });

    expect(mockPrisma.whitelistEmail.deleteMany).toHaveBeenCalledWith({
      where: { email: "alice@next-u.fr" },
    });

    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
    expect(result).toEqual({ data: { success: true } });
  });

  it("supprime l'utilisateur sans email", async () => {
    const user = { id: "u1", email: null };
    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockPrisma.user.delete.mockResolvedValue({});

    const result = await deleteUserService({ id: "u1" });

    expect(mockPrisma.user.delete).toHaveBeenCalledWith({
      where: { id: "u1" },
    });

    expect(mockPrisma.whitelistEmail.deleteMany).not.toHaveBeenCalled();
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
    expect(result).toEqual({ data: { success: true } });
  });

  it("lance une erreur si l'accès admin est refusé", async () => {
    mockCheckAccess.mockRejectedValue(new Error("Accès refusé"));

    await expect(deleteUserService({ id: "u1" })).rejects.toThrow(
      "Accès refusé"
    );
  });
});

describe("deleteInvitedUserService", () => {
  it("supprime un utilisateur invité", async () => {
    mockPrisma.whitelistEmail.delete.mockResolvedValue({});

    await deleteInvitedUserService({ email: "invite@next-u.fr" });

    expect(mockCheckAccess).toHaveBeenCalled();
    expect(mockPrisma.whitelistEmail.delete).toHaveBeenCalledWith({
      where: { email: "invite@next-u.fr" },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/admin");
  });

  it("lance une erreur si l'accès admin est refusé", async () => {
    mockCheckAccess.mockRejectedValue(new Error("Accès refusé"));

    await expect(
      deleteInvitedUserService({ email: "invite@next-u.fr" })
    ).rejects.toThrow("Accès refusé");
  });

  it("gère les erreurs de suppression", async () => {
    const error = new Error("Erreur de suppression");
    mockPrisma.whitelistEmail.delete.mockRejectedValue(error);

    await expect(
      deleteInvitedUserService({ email: "invite@next-u.fr" })
    ).rejects.toThrow("Erreur de suppression");
  });
});
