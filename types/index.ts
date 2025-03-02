import { betaGuild, Guild } from "@prisma/client";
import { JWTPayload } from "jose";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface SessionPayload extends JWTPayload {
  userId: string;
  expiresAt: Date;
}

export interface GuildExtended extends Guild {
  mutual?: boolean;
  betaGuild?: betaGuild | null;
}

export type ModuleName = "welcomer" | "leaver";

export type ImageTextType = "mainText" | "secondText" | "nicknameText";