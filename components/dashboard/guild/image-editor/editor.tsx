"use client";

import {
  createImageCard,
  deleteImageCard,
  updateImageCard,
} from "@/lib/actions";
import { useImageCardStore } from "@/providers/imageCardStoreProvider";
import { Button } from "@heroui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import { AvatarEditor } from "./components/avatar-editor";
import { BackgroundEditor } from "./components/background-editor";
import { JsonEditor } from "./components/json-editor";
import { Preview } from "./components/preview";
import { TextEditor } from "./components/text-editor";
import { Toolbar } from "./components/toolbar";
import { useImageEditor } from "./hooks/use-image-editor";

interface EditorProps {
  module?: string;
  guildId: string;
}

export function Editor({ module, guildId }: EditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Get data from store
  const data = useImageCardStore((state) => state.data);
  const updateConfig = useImageCardStore((state) => state.updateConfig);
  const reset = useImageCardStore((state) => state.reset);
  const cardId = useImageCardStore((state) => state.id);
  const sourceId = useImageCardStore((state) => state.sourceId);

  // Use the preview hook with store data
  const {
    card,
    error: previewError,
    isLoading,
  } = useImageEditor(guildId, data);

  const hasCard = cardId !== undefined;

  const handleSave = async () => {
    if (!hasCard || !cardId || !sourceId) return;

    setIsSaving(true);

    try {
      const result = await updateImageCard(
        {
          id: cardId,
          sourceId,
          data,
        },
        guildId
      );

      if (result.done && result.data) {
        toast.success("Card saved successfully!");
      } else {
        toast.error(result.error || "Failed to save card");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!sourceId) return;

    setIsSaving(true);

    try {
      const result = await createImageCard(sourceId, guildId);

      if (result.done && result.data) {
        toast.success("Card created successfully!");
        // Reload the page to get the new card
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to create card");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!hasCard || !cardId) return;

    setIsSaving(true);

    try {
      const result = await deleteImageCard(cardId, guildId);

      if (result.done) {
        toast.success("Card deleted successfully!");
      } else {
        toast.error(result.error || "Failed to delete card");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all changes? This will revert to the default configuration."
    );
    if (confirmed) {
      reset();
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {module ? `${module} Module Editor` : "Image Card Editor"}
        </h2>
      </div>

      {!hasCard ? (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <p className="text-muted-foreground text-center">
            No image card configured for this module.
            <br />
            Create one to get started.
          </p>
          <Button onPress={handleCreate} isDisabled={isSaving}>
            {!isSaving && (
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            )}
            Create Image Card
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Toolbar
              onReset={handleReset}
              onSave={handleSave}
              isSaving={isSaving}
            />
            <Button
              color="danger"
              onPress={handleDelete}
              isDisabled={isSaving}
              size="sm"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Card
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[calc(100vh-12rem)]">
            {/* Left Column - Configuration */}
            <div className="lg:col-span-2 space-y-6 lg:h-full lg:overflow-y-scroll lg:pb-24">
              <TextEditor
                label="Main Text"
                text={data.mainText}
                onChange={(text) => updateConfig({ mainText: text })}
                placeholder="Welcome {user.username}!"
              />

              <TextEditor
                label="Nickname Text"
                text={data.nicknameText}
                onChange={(text) => updateConfig({ nicknameText: text })}
                placeholder="@{user.username}"
              />

              <TextEditor
                label="Secondary Text"
                text={data.secondText}
                onChange={(text) => updateConfig({ secondText: text })}
                placeholder="Member #{guild.memberCount}"
              />

              <BackgroundEditor
                backgroundColor={data.backgroundColor}
                backgroundImgURL={data.backgroundImgURL}
                onBackgroundColorChange={(color) =>
                  updateConfig({ backgroundColor: color })
                }
                onBackgroundImgURLChange={(url) =>
                  updateConfig({ backgroundImgURL: url })
                }
              />

              <AvatarEditor
                avatarBorderColor={data.avatarBorderColor}
                onAvatarBorderColorChange={(color) =>
                  updateConfig({ avatarBorderColor: color })
                }
              />

              <JsonEditor config={data} onImport={updateConfig} />
            </div>

            {/* Right Column - Preview */}
            <div className="lg:col-span-1 space-y-4">
              <Preview card={card} isLoading={isLoading} error={previewError} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
