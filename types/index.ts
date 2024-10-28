import {
  Embed,
  EmbedAuthor,
  EmbedField,
  EmbedFooter,
  EmbedImage,
  EmbedThumbnail,
  UserGuild,
} from "@prisma/client";
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

// Create a type for all Embed attributes that are relation of the Embed Type exported by prisma
export interface EmbedExtended extends Embed {
  author: EmbedAuthor | null;
  fields: EmbedField[] | null;
  footer: EmbedFooter | null;
  image: EmbedImage | null;
  thumbnail: EmbedThumbnail | null;
}
