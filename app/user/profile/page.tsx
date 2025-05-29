import Image from "next/image";
import { Button } from "@/components/ui/button";

const fakeProfile = {
  name: "Sanda Rakotovelo",
  role: "Ambassadeur Webtech",
  level: "N3",
  description:
    "Ma description Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
  favoriteMoment: "Voyage à Tokyo",
  contact: {
    username: "@sanda.v15",
    phone: "06 66 25 85 94",
  },
};

export default async function ProfilePage() {
  return (
    <div className="max-w-lg w-full p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex justify-center items-center">
          <Image
            src="/profile-placeholder.png"
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold italic">{fakeProfile.name}</h2>
          <p className="text-gray-500 italic">{fakeProfile.role}</p>
          <p className="font-bold">{fakeProfile.level}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 mt-4 text-sm">{fakeProfile.description}</p>

      {/* Button */}
      <div className="mt-4">
        <Button variant="outline" className="w-full">
          Modifier mon profil
        </Button>
      </div>

      {/* Favorite Moment */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold">Mon moment préféré</h3>
        <p className="mt-2 text-gray-600 text-sm">
          {fakeProfile.favoriteMoment}
        </p>
      </div>

      {/* Contact */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Mes contacts</h3>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-background p-2 rounded-full shadow-xs px-4 border">
            <span className="text-primary font-medium">
              {fakeProfile.contact.username}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-background p-2 rounded-full shadow-xs px-4 border">
            <span className="text-primary font-medium">
              {fakeProfile.contact.phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
