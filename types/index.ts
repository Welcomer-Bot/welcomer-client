import { UserGuild } from "@prisma/client";
import { JWTPayload } from "jose";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface SessionPayload extends JWTPayload {
  userId: string;
  expiresAt: Date;
}

export interface GuildExtended extends UserGuild {
  mutual?: boolean;
}

export type ModuleName = "welcomer" | "leaver";
