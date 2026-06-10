"use client";

import {createImageCard, deleteImageCard} from "@/features/dashboard/modules/actions";
import {ImageCardStoreContext, useImageCardStore,} from "@/features/dashboard/modules/providers";
import {Button} from "@heroui/button";
import {Divider} from "@heroui/divider";
import {useRouter} from "next/navigation";
import {useContext, useState, useTransition} from "react";
import {toast} from "react-toastify";
import {AvatarEditor} from "./components/avatar-editor";
import {BackgroundEditor} from "./components/background-editor";
import {EditorHeader} from "./components/editor-header";
import {Preview} from "./components/preview";
import {SaveButton} from "./components/save-button";
import {TextEditor} from "./components/text-editor";
import {BaseCardConfig} from "./types";

interface EditorProps {
  module?: string;
  guildId: string;
}

export function Editor({module, guildId}: EditorProps) {
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
    <div className="flex h-full w-full relative">
      <div className="flex flex-col lg:flex-row lg:h-screen h-full flex-auto w-full">
        {/* Left Column - Configuration */}
        <div className="lg:w-1/2 lg:h-full lg:overflow-y-scroll no-scrollbar lg:pb-24">
          <div className="px-5 pt-5 lg:pb-20 space-y-5 w-full relative">
            {/* Header with back button */}
            <EditorHeader module={module} guildId={guildId}/>

            <Divider className="my-4"/>

            {!hasCard ? (
              <div className="flex flex-col items-center justify-center space-y-6 py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-default-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-default-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">No Image Card</h3>
                  <p className="text-foreground/60 max-w-sm">
                    Create an image card to display a custom welcome or leave
                    image for your members.
                  </p>
                </div>
                <Button
                  color="primary"
                  onPress={handleCreate}
                  isLoading={isCreating}
                  startContent={
                    !isCreating && (
                      <svg
                        className="w-4 h-4"
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
                    )
                  }
                >
                  Create Image Card
                </Button>
              </div>
            ) : (
              <>
                {/* Delete button at the top */}
                <div className="flex justify-end">
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={handleDelete}
                    isLoading={isDeleting}
                    isDisabled={isPending}
                    size="sm"
                    startContent={
                      !isDeleting && (
                        <svg
                          className="w-4 h-4"
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
                      )
                    }
                  >
                    Delete Card
                  </Button>
                </div>

                <TextEditor
                  label="Main Text"
                  text={data.mainText}
                  onChange={(text) => updateConfig({mainText: text})}
                  placeholder="Welcome {username}!"
                />

                <TextEditor
                  label="Nickname Text"
                  text={data.nicknameText}
                  onChange={(text) => updateConfig({nicknameText: text})}
                  placeholder="@{user.username}"
                />

                <TextEditor
                  label="Secondary Text"
                  text={data.secondText}
                  onChange={(text) => updateConfig({secondText: text})}
                  placeholder="Member #{guild.memberCount}"
                />

                <Divider className="my-4"/>

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
              </>
            )}
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="block pb-20 w-full lg:w-1/2 lg:h-full bg-dark-4 lg:overflow-y-auto no-scrollbar">
          <div className="px-5 pt-5 lg:hidden block">
            <Divider className="my-4"/>
            <h2 className="text-white text-lg font-semibold">Preview</h2>
          </div>
          <div className="p-5">
            <Preview
              guildId={guildId}
              config={hasCard ? data : null}
            />
          </div>
        </div>
      </div>

      {/* Floating save button */}
      <SaveButton guildId={guildId}/>
    </div>
  );
}
