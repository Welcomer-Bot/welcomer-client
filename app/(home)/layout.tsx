import { Footer, Navbar } from "@/components/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full justify-center py-16 bg-background">
        {children}
      </main>
      <Footer />
    </>
  );
}
