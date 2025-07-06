import { Footer } from "@/components/features/layout/footer";
import { Header } from "@/components/features/layout/header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 max-w-lg m-auto py-14 w-full">{children}</div>
      <Footer />
    </div>
  );
}
