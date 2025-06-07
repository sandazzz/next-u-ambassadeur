import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { EditProfileDialog } from "./edit-profile-dialog";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || session.user.role !== "ambassador") {
    redirect("/");
  }
  const profile = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!profile) {
    redirect("/");
  }

  return (
    <div className="max-w-lg w-full p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={profile.image ?? undefined}
            alt={profile.name ?? "Avatar"}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold italic">{profile.name}</h2>
          <p className="text-gray-500 italic">Ambassadeur {profile.school}</p>
          <p className="font-bold">
            {profile.promoYear && profile.promoYear < 4
              ? "N" + profile.promoYear
              : "M" + profile.promoYear}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mt-4 text-sm">{profile.description}</p>

      {/* Button */}
      <div className="mt-4">
        <EditProfileDialog profile={profile} />
      </div>

      {/* Favorite Moment */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold">Mon moment préféré</h3>
        <p className="mt-2 text-gray-600 text-sm">{profile.favoriteMoment}</p>
      </div>

      {/* Contact */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Mes contacts</h3>
        <div className="flex gap-2">
          {profile.instagram ? (
            <div className="flex items-center gap-2 bg-background p-2 rounded-full shadow-xs px-4 border">
              <span className="text-primary font-medium italic">
                @{profile.instagram}
              </span>
            </div>
          ) : null}
          {profile.phone ? (
            <div className="flex items-center gap-2 bg-background p-2 rounded-full shadow-xs px-4 border">
              <span className="text-primary font-medium">{profile.phone}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
