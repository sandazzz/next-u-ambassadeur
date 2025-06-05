import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Form() {
  const session = await auth();

  if (!session || session.user.role !== "ambassador") {
    redirect("/");
  }
  return <div>Forms</div>;
}
