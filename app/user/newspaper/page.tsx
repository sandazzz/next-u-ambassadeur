import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Newspaper() {
  const session = await auth();

  if (!session || session.user.role !== "ambassador") {
    redirect("/");
  }
  return (
    <div className=" flex justify-center w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Image
        src="/img/Gazette Oct 2024.avif"
        width={500}
        height={500}
        priority={false}
        alt="Image de la gazette"
      ></Image>
    </div>
  );
}
