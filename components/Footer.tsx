import Link from "next/link";
import { Logo } from "./Logo";
import { Divider } from "@heroui/divider";

export default function Footer() {
  return (
    <footer className="bg-background w-full text-white mt-16 mb-5 max-w-7xl mx-auto px-4">
      <div className="flex md:flex-row flex-col gap-4 justify-between w-full">
        <div className="gap-3 flex flex-col">
          <Logo />
          <h4 className=" text-gray-400 max-w-xs">
            Welcome discord users to your server with Welcomer, the ultimate
            discord bot for creating custom welcome messages and images.
          </h4>
        </div>
        <div className="flex flex-row gap-6">
          <div className="flex">
            <div className="flex flex-col gap-2">
              <p className="text-lg">Website Pages</p>
              <div className="flex flex-col gap-1">
                <Link href="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link href="/status" className="text-gray-400 hover:text-white">
                  Status
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg">Other Links</p>
            <div className="flex flex-col gap-1">
              <Link
                href="https://top.gg/bot/1008260316192329749"
                className="text-gray-400 hover:text-white"
              >
                Vote
              </Link>
              <Link
                href="https://github.com/Welcomer-Bot"
                className="text-gray-400 hover:text-white"
              >
                Github
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-white">
                Support Server
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg">Legal</p>
            <div className="flex flex-col gap-1">
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Divider className="my-5" />
      <div>
        <p className="text-center text-gray-400 py-4">
          © 2025 Welcomer. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
