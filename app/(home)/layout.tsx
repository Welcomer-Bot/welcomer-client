import Footer from "@/components/Footer";
import { Navbar } from "@/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full grid content-center">
        {children}
      </main>
      <Footer />
    </>
  );
}
