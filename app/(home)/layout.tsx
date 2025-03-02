import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://github.com/Welcomer-Bot"
          title="Welcomer bot github"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">Welcomer</p>
        </Link>
      </footer>
    </>
  );
}
