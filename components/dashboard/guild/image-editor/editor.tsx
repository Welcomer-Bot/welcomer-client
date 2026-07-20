"use client";

import {createImageCard, deleteImageCard} from "@/features/dashboard/modules/actions";
import {ImageCardStoreContext, useImageCardStore,} from "@/features/dashboard/modules/providers";
import {useRouter} from "next/navigation";
import {useContext, useState, useTransition} from "react";
import {toast} from "react-toastify";
import {AvatarEditor} from "./components/avatar-editor";
import {BackgroundEditor} from "./components/background-editor";
import {CardDangerZone} from "./components/card-danger-zone";
import {CardEmptyState} from "./components/card-empty-state";
import {Preview} from "./components/preview";
import {SaveButton} from "./components/save-button";
import {TextEditor} from "./components/text-editor";
import {BaseCardConfig, DEFAULT_CONFIG} from "./types";

interface EditorProps {
  guildId: string;
}

export function Editor({guildId}: EditorProps) {
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Get store context for direct state updates
  const store = useContext(ImageCardStoreContext);

  const data = useImageCardStore((state) => state.data);
  const updateConfig = useImageCardStore((state) => state.updateConfig);
  const cardId = useImageCardStore((state) => state.id);
  const sourceId = useImageCardStore((state) => state.sourceId);

  const hasCard = cardId !== null && cardId !== undefined;

  const handleCreate = async () => {
    if (!sourceId || !store) return;

    setIsCreating(true);

    try {
      const result = await createImageCard(sourceId, guildId);

      if (result.done && result.data) {
        toast.success("Card created successfully!");

        // Update the store with the new card data
        store.setState({
          id: result.data.id,
          sourceId: result.data.sourceId,
          data: (result.data.data as BaseCardConfig) || {},
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt,
        });

        // Refresh the router to update server components
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast.error(result.error || "Failed to create card");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!hasCard || !cardId || !store) return;

    setIsDeleting(true);

    try {
      const result = await deleteImageCard(cardId, guildId);

      if (result.done) {
        toast.success("Card deleted successfully!");

        // Reset the store to remove the card
        store.setState({
          id: undefined,
          data: {},
          createdAt: undefined,
          updatedAt: undefined,
        });

        // Refresh the router to update server components
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast.error(result.error || "Failed to delete card");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    // No height or overflow of its own: the document scrolls, and the preview
    // sticks alongside the form instead of owning a second scroll container.
    <div className="w-full">
      <div className="flex w-full flex-col lg:flex-row">
        {/* Left Column - Configuration */}
        <div className="w-full lg:w-1/2">
          <div className="w-full space-y-5 px-5 py-5 lg:pb-24">
            {!hasCard ? (
              <CardEmptyState isCreating={isCreating} onCreate={handleCreate}/>
            ) : (
              <>
                <TextEditor
                  label="Main Text"
                  text={data.mainText}
                  onChange={(text) => updateConfig({mainText: text})}
                  placeholder={DEFAULT_CONFIG.mainText?.content}
                />

                <TextEditor
                  label="Nickname Text"
                  text={data.nicknameText}
                  onChange={(text) => updateConfig({nicknameText: text})}
                  placeholder={DEFAULT_CONFIG.nicknameText?.content}
                />

                <TextEditor
                  label="Secondary Text"
                  text={data.secondText}
                  onChange={(text) => updateConfig({secondText: text})}
                  placeholder={DEFAULT_CONFIG.secondText?.content}
                />

                <BackgroundEditor
                  backgroundColor={data.backgroundColor}
                  backgroundImgURL={data.backgroundImgURL}
                  onBackgroundColorChange={(color) =>
                    updateConfig({backgroundColor: color})
                  }
                  onBackgroundImgURLChange={(url) =>
                    updateConfig({backgroundImgURL: url})
                  }
                />

                <AvatarEditor
                  avatarBorderColor={data.avatarBorderColor}
                  onAvatarBorderColorChange={(color) =>
                    updateConfig({avatarBorderColor: color})
                  }
                />

                <CardDangerZone
                  isDeleting={isDeleting}
                  isDisabled={isPending}
                  onDelete={handleDelete}
                />
              </>
            )}
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="w-full border-divider bg-content2 lg:w-1/2 lg:border-l">
          <div className="lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto">
            <h2 className="px-5 pt-5 text-lg font-semibold text-foreground">
              Preview
            </h2>
            <div className="p-5">
              <Preview
                guildId={guildId}
                config={hasCard ? data : null}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating save button */}
      <SaveButton guildId={guildId}/>
    </div>
  );
}
