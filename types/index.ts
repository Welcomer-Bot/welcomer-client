import { JWTPayload } from "jose";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface SessionPayload extends JWTPayload {
  sessionId: string;
  expiresAt: Date;
}
