"use client";
import { createSource } from "@/lib/actions";
import { Button } from "@heroui/button";
import { usePlausible } from "next-plausible";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";
import { SourceType } from "../../../generated/prisma/browser";

function SubmitButton({ sourceType }: { sourceType: SourceType }) {
  const { pending } = useFormStatus();

  return (
    <Button color="primary" isLoading={pending} type="submit">
      Enable {sourceType}
    </Button>
  );
}

export default function EnableModuleButton({
  guildId,
  sourceType,
}: {
  guildId: string;
  sourceType: SourceType;
}) {
  const plausible = usePlausible();

  async function handleSubmit() {
    plausible("EnableModuleButton", {
      props: {
        sourceType,
      },
    });
    try {
      await createSource(guildId, sourceType);
    } catch (e) {
      console.log("error", e);
      if (e instanceof Error) {
        toast.error(e.message || "An error occurred");
      } else {
        toast.error("An error occurred");
      }
    }
  }

  return (
    <form action={handleSubmit}>
      <SubmitButton sourceType={sourceType} />
    </form>
  );
}
