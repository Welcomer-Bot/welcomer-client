// Main component
export { Editor } from "./editor";

// Types
export type { BaseCardConfig, Color, HEX, RGB, RGBA, TextCard } from "./types";

export {
  DEFAULTS,
  DEFAULT_CONFIG,
  FONT_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  COLOR_PRESETS,
  BACKGROUND_PRESETS,
  TEXT_SIZE_MIN,
  TEXT_SIZE_MAX,
  TEXT_DEFAULTS,
} from "./types";

// Hooks
export { useImageEditor } from "./hooks/use-image-editor";

// Components
export { AvatarEditor } from "./components/avatar-editor";
export { BackgroundEditor } from "./components/background-editor";
export { Preview } from "./components/preview";
export { TextEditor } from "./components/text-editor";
