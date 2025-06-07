import { Footer } from "@/components/feature/layout/footer";
import { Header } from "@/components/feature/layout/header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 max-w-lg m-auto py-14 w-full">{children}</div>
      <Footer />
    </div>
  );
}
