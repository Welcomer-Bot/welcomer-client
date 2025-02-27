import Link from "next/link";

import { Navbar } from "@/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="content-center h-full">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3bottom-0">
        <Link
          className="flex items-center gap-1 text-current"
          href="https://github.com/Welcomer-Bot"
          title="Welcomer bot github"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">Welcomer</p>
        </Link>
      </footer>
    </div>
  );
}
