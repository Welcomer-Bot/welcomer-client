/**
 * Dashboard Editor - Main Orchestrator
 *
 * Composant racine pour l'éditeur de messages welcome/leave.
 * Orchestre l'édition du contenu (text, embeds) et de l'image.
 *
 * Features:
 * - Message content editor (texte, embeds)
 * - Image card editor (position, design)
 * - Message preview (Discord embed simulation)
 * - Save button (server action + validation)
 *
 * @see components/dashboard/guild/editor/content-editor.tsx
 * @see components/dashboard/guild/editor/embed/embed-editor.tsx
 * @see components/dashboard/guild/editor/image-position-editor.tsx
 * @see components/dashboard/guild/editor/save-button.tsx
 */

import SendMenu from "@/components/dashboard/guild/editor/send-menu";
import Guild from "@/lib/discord/guild";

import { getUser } from "@/lib/dal/session";
import ContentEditor from "./content-editor";
import EditorMessagePreview from "./editor-message-preview";
import { EmbedEditor } from "./embed/embed-editor";
import ImagePositionEditor from "./image-position-editor";
import SaveButton from "./save-button";

export async function Editor({ guild }: { guild: Guild }) {
  const user = await getUser();
  const channels = await guild.getChannels();
  return (
    // No height or overflow of its own: the document scrolls, and the preview
    // sticks alongside the form instead of owning a second scroll container.
    <div className="editor w-full">
      <div className="flex w-full flex-col lg:flex-row">
        <div className="w-full lg:w-1/2">
          <form className="w-full space-y-5 px-5 py-5 lg:pb-24">
            <SendMenu channels={channels} />
            <ContentEditor />
            <EmbedEditor />
            <ImagePositionEditor />
          </form>
        </div>
        <div className="w-full border-divider bg-content2 lg:w-1/2 lg:border-l">
          <div className="lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
            <h2 className="px-5 pt-5 text-lg font-semibold text-foreground">
              Preview
            </h2>
            <EditorMessagePreview
              guild={guild.toObject()}
              user={user!.toObject()}
            />
          </div>
        </div>
      </div>
      <SaveButton />
    </div>
  );
}
