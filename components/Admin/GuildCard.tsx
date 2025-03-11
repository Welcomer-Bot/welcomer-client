import Guild from "@/lib/discord/guild";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import { toast } from "react-toastify";

export default function GuildCard({ guild }: { guild: Guild }) {
  return (
    <Card>
      <CardHeader className="flex flex-row space-x-5">
        <div>
          {guild.iconUrl ? (
            <Image
              className="rounded-lg"
              src={guild.iconUrl}
              alt={`${guild.id} icon`}
              width={48}
              height={48}
            />
          ) : (
            <p className="w-12 h-12 rounded-lg bg-slate-200 text-black px-3 text-small">
              No icon
            </p>
          )}
        </div>
        <div>
          <h3>{guild.name}</h3>
          <p>{guild.id}</p>
        </div>
      </CardHeader>
      <CardBody>
        <p>Member count: {guild.memberCount}</p>
        <div>
          {guild.beta ? (
            <Button
              className="max-w-xs"
              color="danger"
              variant="ghost"
              onPress={() => guild.enrollToBetaProgram()}
            >
              Leave beta program
            </Button>
          ) : (
            <Button
              className="max-w-xs"
              color="primary"
              onPress={() => guild.removeFromBetaProgram()}
            >
              Integrate guild to beta program
            </Button>
          )}
          {guild.mutual && (
            <Button
              onPress={async () => {
                const res = await guild.leave();
                if (res) {
                  toast.success("Left guild");
                } else {
                  toast.error("Failed to leave guild");
                }
              }}
            >
              Leave guild
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
