import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CreateUserButton } from "@/components/features/admin/users-management/create-user-button";

// ✅ On mocke uniquement ce qui bloque Jest : `next-safe-action`
jest.mock("next-safe-action/hooks", () => ({
  useAction: jest.fn(() => ({
    executeAsync: jest.fn(),
  })),
}));

describe("CreateUserButton", () => {
  it("affiche le bouton Ajouter un utilisateur", () => {
    render(<CreateUserButton />);
    expect(
      screen.getByRole("button", { name: /ajouter un utilisateur/i })
    ).toBeInTheDocument();
  });
});
