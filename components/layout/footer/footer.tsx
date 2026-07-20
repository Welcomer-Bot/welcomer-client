import { Logo } from "@/components/shared";
import { Divider } from "@heroui/divider";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-background w-full text-foreground mt-16 mb-5 max-w-7xl mx-auto px-4">
      <div className="flex md:flex-row flex-col gap-4 justify-between w-full">
        <div className="gap-3 flex flex-col">
          <Logo />
          <h4 className=" text-default-500 max-w-xs">
            Welcome discord users to your server with Welcomer, the ultimate
            discord bot for creating custom welcome messages and images.
          </h4>
        </div>
        <div className="flex flex-row gap-6">
          <div className="flex">
            <div className="flex flex-col gap-2">
              <p className="text-lg">Website Pages</p>
              <div className="flex flex-col gap-1">
                <Link href="/" className="text-default-500 hover:text-foreground">
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="text-default-500 hover:text-foreground"
                >
                  Dashboard
                </Link>
                <Link href="/status" className="text-default-500 hover:text-foreground">
                  Status
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg">Other Links</p>
            <div className="flex flex-col gap-1">
              <Link
                prefetch={false}
                href="https://top.gg/bot/1008260316192329749"
                className="text-default-500 hover:text-foreground"
              >
                Vote
              </Link>
              <Link
                prefetch={false}
                href="https://github.com/Welcomer-Bot"
                className="text-default-500 hover:text-foreground"
              >
                Github
              </Link>
              <Link
                href="/support"
                prefetch={false}
                className="text-default-500 hover:text-foreground"
              >
                Support Server
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg">Legal</p>
            <div className="flex flex-col gap-1">
              <Link
                prefetch={false}
                href="/terms"
                className="text-default-500 hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                prefetch={false}
                href="/privacy"
                className="text-default-500 hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Divider className="my-5" />
      <div>
        <p className="text-center text-default-500 py-4">
          © 2025 Welcomer. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
export { Footer };

