import GuildCardLoader from "@/components/loader/guildCardLoader";

export default function Loading() {
  return (
    <div className="flex flex-wrap items-center justify-center">
      {Array.from({ length: 3 }).map((_, i) => (
        <GuildCardLoader key={i} />
      ))}
    </div>
  );
}
