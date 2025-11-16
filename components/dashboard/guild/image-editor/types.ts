export type RGB = `rgb(${number},${"" | " "}${number},${"" | " "}${number})`;
export type RGBA =
  `rgba(${number},${"" | " "}${number},${"" | " "}${number},${"" | " "}${number})`;
export type HEX = `#${string}`;
export type Color = RGB | RGBA | HEX;

export interface TextCard {
  content: string;
  color?: Color | string | null;
  font?: string;
  size?: number;
  weight?: string;
}

export interface BaseCardConfig {
  mainText?: TextCard | null;
  nicknameText?: TextCard | null;
  secondText?: TextCard | null;
  backgroundColor?: Color | string | null;
  backgroundImgURL?: string | null;
  avatarBorderColor?: Color | string | null;
}

export const DEFAULT_CONFIG: BaseCardConfig = {
  mainText: {
    content: "Welcome {username}!",
    color: "#ffffff",
    font: "Arial",
    size: 48,
    weight: "bold",
  },
  nicknameText: {
    content: "@{username}",
    color: "#cccccc",
    font: "Arial",
    size: 32,
    weight: "normal",
  },
  secondText: {
    content: "Member #{memberCount}",
    color: "#aaaaaa",
    font: "Arial",
    size: 24,
    weight: "normal",
  },
  backgroundColor: "#2c2f33",
  backgroundImgURL: null,
  avatarBorderColor: "#7289da",
};

export const FONT_OPTIONS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Georgia",
  "Comic Sans MS",
  "Impact",
  "Trebuchet MS",
];

export const FONT_WEIGHT_OPTIONS = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
];
