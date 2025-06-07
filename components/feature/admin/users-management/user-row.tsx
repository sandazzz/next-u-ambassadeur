"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coins } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { adjustCredits } from "@/components/feature/admin/users-management/credits-management.action";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  credit: number | null;
  role: string;
}

export function UserRow({ user }: { user: User }) {
  const { executeAsync: executeAdjustCredits } = useAction(adjustCredits, {
    onSuccess: () => {
      toast.success("Crédits ajustés avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajustement des crédits");
    },
  });

  const handleAdjustCredits = async (type: "add" | "remove") => {
    await executeAdjustCredits({
      userId: user.id,
      type,
    });
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
            <AvatarFallback>
              {user.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.role === "ambassador" ? "default" : "secondary"}>
          {user.role === "ambassador" ? "Ambassadeur" : "Utilisateur"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Coins className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">{user.credit ?? 0}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustCredits("add")}
          >
            +1
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustCredits("remove")}
          >
            -1
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
