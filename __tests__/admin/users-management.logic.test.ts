import {
  createUserImpl,
  deleteUserImpl,
  updateUserImpl,
  updateUserSchema,
} from "@/components/features/admin/users-management/users-management.logic";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/auth";
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
  };
  user: {
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

const mockCheckAccess = checkAdminAccess as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockCheckAccess.mockResolvedValue(undefined);
});

describe("createUserImpl", () => {
  it("refuse un email déjà utilisé", async () => {
    mockPrisma.whitelistEmail.findUnique.mockResolvedValue({
      email: "test@next-u.fr",
    });

    const result = await createUserImpl({
      name: "Alice",
      email: "test@next-u.fr",
      role: "admin",
    });

    expect(result).toEqual({ error: "Cet email est déjà utilisé" });
  });

  it("crée un utilisateur s'il est nouveau", async () => {
    const mockUser = { id: "123", email: "alice@next-u.fr" };
    mockPrisma.whitelistEmail.findUnique.mockResolvedValue(null);
    mockPrisma.whitelistEmail.create.mockResolvedValue(mockUser);

    const result = await createUserImpl({
      name: "Alice",
      email: "alice@next-u.fr",
      role: "admin",
    });

    expect(mockPrisma.whitelistEmail.create).toHaveBeenCalledWith({
      data: { email: "alice@next-u.fr" },
    });
    expect(result).toEqual({ data: mockUser });
  });
});

describe("updateUserImpl", () => {
  it("renvoie une erreur si l'utilisateur n'existe pas", async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);

    const result = await updateUserImpl({
      id: "u1",
      name: "Alice",
      email: "alice@next-u.fr",
      role: "admin",
    });

    expect(result).toEqual({ error: "Utilisateur non trouvé" });
  });

  it("renvoie une erreur si l'email est déjà utilisé", async () => {
    mockPrisma.user.findUnique
      .mockResolvedValueOnce({ id: "u1", email: "old@next-u.fr" }) // 1er appel : user existant
      .mockResolvedValueOnce({ id: "u2", email: "alice@next-u.fr" }); // 2e appel : email pris

    const result = await updateUserImpl({
      id: "u1",
      name: "Alice",
      email: "alice@next-u.fr",
      role: "admin",
    });

    expect(result).toEqual({ error: "Cet email est déjà utilisé" });
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

    const result = await updateUserImpl(updatedUser);

    expect(result).toEqual({ data: updatedUser });
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: {
        name: "Alice",
        email: "alice@next-u.fr",
        role: "admin",
      },
    });
  });
});

describe("deleteUserImpl", () => {
  it("renvoie une erreur si l'utilisateur n'existe pas", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const result = await deleteUserImpl({ id: "u1" });

    expect(result).toEqual({ error: "Utilisateur non trouvé" });
  });

  it("supprime l'utilisateur et sa whitelist", async () => {
    const user = { id: "u1", email: "alice@next-u.fr" };
    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockPrisma.user.delete.mockResolvedValue({});
    mockPrisma.whitelistEmail.deleteMany.mockResolvedValue({});

    const result = await deleteUserImpl({ id: "u1" });

    expect(mockPrisma.user.delete).toHaveBeenCalledWith({
      where: { id: "u1" },
    });

    expect(mockPrisma.whitelistEmail.deleteMany).toHaveBeenCalledWith({
      where: { email: "alice@next-u.fr" },
    });

    expect(result).toEqual({ data: { success: true } });
  });
});
