import { JWTPayload } from "jose";
import { SVGProps } from "react";
import { GuildStats, Period, SourceType } from "@/prisma/generated/client";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface SessionPayload extends JWTPayload {
  id: string;
  expiresAt: Date;
}

export type ImageTextType = "mainText" | "secondText" | "nicknameText";

export type StatsDictionary = {
  [key in Period]: GuildStats | null;
};
