import { Button } from "@heroui/react";

export default function Page() {
  return (
    <div className="px-5 mx-auto flex flex-col gap-4 text-center justify-center items-center h-full max-w-3xl">
      <h1 className="text-3xl font-bold">Help (comming soon)</h1>
      <p className="text-lg">
        You&apos;d like to help us improve Welcomer? Join our Discord server and
        let us know what you think! We are always looking for feedback and
        suggestions to make Welcomer even better.
        <br />
        <br />
      </p>
      <Button>
        <a
          href="https://discord.gg/7TGc5ZZ7aM"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join our Discord
        </a>
      </Button>
    </div>
  );
}
