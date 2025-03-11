import { JWTPayload } from "jose";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface SessionPayload extends JWTPayload {
  id: string;
  expiresAt: Date;
}

export type ModuleName = "welcomer" | "leaver";

export type ImageTextType = "mainText" | "secondText" | "nicknameText";