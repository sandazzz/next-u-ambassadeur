import { prisma } from "@/lib/prisma";
import { EditProfileForm } from "./edit-profile";
import { notFound } from "next/navigation";

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await prisma.user.findUnique({
    where: { id },
  });

  if (!profile) {
    notFound();
  }

  return <EditProfileForm profile={profile} />;
}
