import Link from "next/link";

import { Navbar } from "@/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          className="flex items-center gap-1 text-current"
          href="github.com/Welcomer-Bot"
          title="Welcomer bot github"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">Welcomer</p>
        </Link>
      </footer>
    </div>
  );
}
