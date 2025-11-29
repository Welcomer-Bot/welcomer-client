"use server";

import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";

import { ImageCard, Source } from "@/generated/prisma/client";
import { SourceType } from "@/generated/prisma/enums";
import { ImageCardState } from "@/state/imageCard";
import { SourceState } from "@/state/source";
import { MessageBuilder, ValidationError } from "@discordjs/builders";
import { EmbedData } from "discord.js";
import z from "zod";
import {
  createSource as createSourceRequest,
  deleteSource,
  getUserGuild,
} from "./dal";
import prisma from "./prisma";
import { deleteSession } from "./session";

export async function signIn() {
  redirect("/api/auth/login");
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}

export async function createSource(
  guildId: string,
  source: SourceType,
): Promise<void> {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    throw new Error("You do not have permission to manage this guild");
  }
  try {
    await createSourceRequest(guild.id, source);
  } catch (e) {
    console.log("error", e);
    throw new Error("An error occurred while creating the source");
  }
  revalidatePath(`/dashboard/${guildId}`);
}

export async function removeSource(
  guildId: string,
  sourceId: number,
): Promise<void> {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    throw new Error("You do not have permission to manage this guild");
  }
  await deleteSource(guildId, sourceId);
  revalidatePath(`/dashboard/${guildId}`);
}

export async function updateSource(store: Partial<SourceState>): Promise<{
  data: Source | null;
  done: boolean;
  error: string | null;
}> {
  console.log("updateSource", store);
  const guildId = store.guildId;
  const sourceId = store.id;
  console.log("store", store);
  if (!guildId) {
    return {
      data: null,
      done: false,
      error: "You need to select a guild",
    };
  }
  if (!sourceId) {
    return {
      data: null,
      done: false,
      error: "You need to select a source",
    };
  }
  const guild = await getUserGuild(guildId);
  if (!guild) {
    return {
      data: null,
      done: false,
      error: "You do not have permission to manage this guild",
    };
  }
  if (!store.channelId) {
    return {
      data: null,
      done: false,
      error: "You need to select a channel",
    };
  }
  if (!store.message) {
    return {
      data: null,
      done: false,
      error: "Message cannot be null",
    };
  }

  console.log("Checking image card deletion");
  console.log("store.imageEmbedIndex", store.imageEmbedIndex);
  console.log("store.imagePosition", store.imagePosition);

  if (store.imageEmbedIndex == undefined && store.imagePosition === undefined) {
    deleteActiveImageCard(sourceId, guildId);
    store.imagePosition = undefined;
  }

  try {
    console.log("Validating message", store.message);
    let embedIndex: number | undefined = undefined;
    store.message.embeds?.map((embed, i: number) => {
      if (embed.image && embed.image.url === "imageCard") {
      // Remove image before validation
      embed.image = undefined;
      embedIndex = i;
      }
    });
    new MessageBuilder(store.message).toJSON();
    store.message.embeds?.map((embed, i: number) => {
      if (
        embedIndex !== undefined &&
        i === embedIndex &&
        store.imagePosition === "embed"
      ) {
        // Restore image after validation
        embed.image = { url: "imageCard" };
      }
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log("Validation error details:", e.name);
      console.log(e.cause);

      // return error and format message correctly to be user friendly
      // TODO: prettify error message
      return {
        data: null,
        done: false,
        error: z.prettifyError(e.cause),
      };
    } else {
      console.error("Unexpected error:", e);
    }
    return {
      data: null,
      done: false,
      error: "Message is not valid",
    };
  }
  // if (!validation.success) {
  //   return {
  //     data: null,
  //     done: false,
  //     error: "Message is not valid",
  //   };
  // }
  if (
    store.imagePosition &&
    store.imagePosition == "embed" &&
    store.imageEmbedIndex !== undefined
  ) {
    const embed = store.message.embeds?.[store.imageEmbedIndex];
    if (!embed) {
      return {
        data: null,
        done: false,
        error: "Embed index for image is invalid",
      };
    }
    console.log("Setting embed image");
    embed.image = { url: "imageCard" };
  }

  try {
    const res = await prisma.source.update({
      where: {
        id: sourceId,
      },
      data: {
        channelId: store.channelId,
        message: store.message,
        // TODO: Update image
      },
    });

    revalidatePath(`/dashboard/${guildId}`);
    return {
      data: res,
      done: true,
      error: null,
    };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return {
        data: null,
        done: false,
        error: error.message,
      };
    }
    return {
      data: null,
      done: false,
      error: "An error occurred while updating the source",
    };
  }
}

// export async function updateCards(
//   currentStore: ImageState,
//   guildId: string
// ): Promise<{
//   data:
//     | (Source & {
//         images: ImageCard[];
//       })
//     | null;
//   done: boolean;
//   error: string | null;
// }> {
//   try {
//     const store = currentStore;
//     // console.log("store", store);
//     const sourceId = store.sourceId;
//     if (!sourceId) {
//       throw new Error("You need to select a module");
//     }
//     // console.log("guildId", guildId);
//     const guild = await getUserGuild(guildId);
//     // console.log("guild", guild);
//     if (!guild) {
//       throw new Error("You do not have permission to manage this guild");
//     }
//     const source = await getSource(guildId, sourceId);

//     if (!source) {
//       throw new Error("This module does not exist");
//     }
//     const cardsLength = (await getSourceCards(source.id))?.length ?? 0;

//     // All cards except the active card, we can get the active card with selectedCard which is the index of the card in store.imageCards
//     const nonActiveCard =
//       store.selectedCard !== null &&
//       store.imageCards[store.selectedCard] !== undefined &&
//       store.imageCards[store.selectedCard].id !== undefined
//         ? store.imageCards
//         : store.imageCards?.filter(
//             (card, index) => index !== store.selectedCard
//           );
//     const cardsToCreate =
//       nonActiveCard?.filter((card) => card.id === undefined) ?? [];
//     const cardsToDelete =
//       store.removedCard?.filter((card) => card.id !== undefined) ?? [];
//     const cardsToUpdate =
//       nonActiveCard?.filter((card) => card.id !== undefined) ?? [];

//     if (cardsLength + cardsToCreate.length > 5)
//       throw new Error("You cannot have more than 5 cards");

//     const res = await prisma.source.update({
//       where: {
//         id: sourceId,
//       },
//       data: {
//         activeCard:
//           store.selectedCard !== null &&
//           store.imageCards[store.selectedCard] !== undefined
//             ? {
//                 connectOrCreate: {
//                   where: {
//                     id: store.imageCards[store.selectedCard].id ?? -1,
//                   },
//                   create: {
//                     backgroundImgURL:
//                       store.imageCards[store.selectedCard].backgroundImgURL,
//                     backgroundColor:
//                       store.imageCards[store.selectedCard].backgroundColor ||
//                       null,
//                     avatarBorderColor:
//                       store.imageCards[store.selectedCard].avatarBorderColor ||
//                       null,
//                     mainText: store.imageCards[store.selectedCard].mainText
//                       ? {
//                           create: {
//                             content:
//                               store.imageCards[store.selectedCard]?.mainText
//                                 ?.content ?? "",
//                             color:
//                               store.imageCards[store.selectedCard].mainText
//                                 ?.color || null,
//                             font:
//                               store.imageCards[store.selectedCard].mainText
//                                 ?.font || null,
//                           },
//                         }
//                       : undefined,
//                     secondText: store.imageCards[store.selectedCard].secondText
//                       ? {
//                           create: {
//                             content:
//                               store.imageCards[store.selectedCard].secondText
//                                 ?.content ?? "",
//                             color:
//                               store.imageCards[store.selectedCard].secondText
//                                 ?.color || null,
//                             font:
//                               store.imageCards[store.selectedCard].secondText
//                                 ?.font || null,
//                           },
//                         }
//                       : undefined,
//                     nicknameText: store.imageCards[store.selectedCard]
//                       .nicknameText
//                       ? {
//                           create: {
//                             content:
//                               store.imageCards[store.selectedCard].nicknameText
//                                 ?.content ?? "",
//                             color:
//                               store.imageCards[store.selectedCard].nicknameText
//                                 ?.color || null,
//                             font:
//                               store.imageCards[store.selectedCard].nicknameText
//                                 ?.font || null,
//                           },
//                         }
//                       : undefined,
//                     Source: {
//                       connect: {
//                         id: sourceId,
//                       },
//                     },
//                   },
//                 },
//               }
//             : {
//                 disconnect: true,
//               },

//         images: {
//           create: cardsToCreate.map((card) => ({
//             backgroundImgURL: card.backgroundImgURL,
//             backgroundColor: card.backgroundColor || null,
//             avatarBorderColor: card.avatarBorderColor || null,
//             mainText: card.mainText
//               ? {
//                   create: {
//                     content: card.mainText.content,
//                     color: card.mainText.color || null,
//                     font: card.mainText.font || null,
//                   },
//                 }
//               : undefined,
//             secondText: card.secondText
//               ? {
//                   create: {
//                     content: card.secondText.content,
//                     color: card.secondText.color || null,
//                     font: card.secondText.font || null,
//                   },
//                 }
//               : undefined,
//             nicknameText: card.nicknameText
//               ? {
//                   create: {
//                     content: card.nicknameText.content,
//                     color: card.nicknameText.color || null,
//                     font: card.nicknameText.font || null,
//                   },
//                 }
//               : undefined,
//           })),
//           deleteMany: cardsToDelete
//             .filter((card) => card.id !== undefined)
//             .map((card) => ({
//               id: card.id,
//             })),
//           update: cardsToUpdate
//             .filter((card) => card.id !== undefined)
//             .map((card) => ({
//               where: {
//                 id: card.id,
//               },
//               data: {
//                 backgroundImgURL: card.backgroundImgURL,
//                 backgroundColor: card.backgroundColor || null,
//                 avatarBorderColor: card.avatarBorderColor || null,
//                 mainText: card.mainText
//                   ? {
//                       upsert: {
//                         where: {
//                           id: card.mainText.id ?? -1,
//                         },
//                         create: {
//                           content: card.mainText.content,
//                           color: card.mainText.color || null,
//                           font: card.mainText.font || null,
//                         },
//                         update: {
//                           content: card.mainText.content,
//                           color: card.mainText.color || null,
//                           font: card.mainText.font || null,
//                         },
//                       },
//                     }
//                   : {
//                       disconnect: true,
//                     },
//                 secondText: card.secondText
//                   ? {
//                       upsert: {
//                         where: {
//                           id: card.secondText.id ?? -1,
//                         },
//                         create: {
//                           content: card.secondText.content,
//                           color: card.secondText.color || null,
//                           font: card.secondText.font || null,
//                         },
//                         update: {
//                           content: card.secondText.content,
//                           color: card.secondText.color || null,
//                           font: card.secondText.font || null,
//                         },
//                       },
//                     }
//                   : {
//                       disconnect: true,
//                     },
//                 nicknameText: card.nicknameText
//                   ? {
//                       upsert: {
//                         where: {
//                           id: card.nicknameText.id ?? -1,
//                         },
//                         create: {
//                           content: card.nicknameText.content,
//                           color: card.nicknameText.color || null,
//                           font: card.nicknameText.font || null,
//                         },
//                         update: {
//                           content: card.nicknameText.content,
//                           color: card.nicknameText.color || null,
//                           font: card.nicknameText.font || null,
//                         },
//                       },
//                     }
//                   : {
//                       disconnect: true,
//                     },
//               },
//             })),
//         },
//       },
//       include: {
//         images: {
//           include: {
//             mainText: true,
//             secondText: true,
//             nicknameText: true,
//           },
//         },
//         activeCard: {
//           include: {
//             mainText: true,
//             secondText: true,
//             nicknameText: true,
//           },
//         },
//       },
//     });
//     revalidatePath(
//       `/dashboard/${guildId}/${source.type.toLowerCase().slice(0, -1)}`
//     );

//     return {
//       data: res,
//       done: true,
//       error: null,
//     };
//   } catch (error) {
//     console.log(error);
//     if (error instanceof Error) {
//       return {
//         data: null,
//         done: false,
//         error: error.message,
//       };
//     }

//     return {
//       data: null,
//       done: false,
//       error: "An error occurred while updating the image module",
//     };
//   }
// }

// ImageCard actions
export async function createImageCard(
  sourceId: number,
  guildId: string,
): Promise<{
  data: ImageCard | null;
  done: boolean;
  error: string | null;
}> {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    return {
      data: null,
      done: false,
      error: "You do not have permission to manage this guild",
    };
  }

  try {
    const card = await prisma.imageCard.create({
      data: {
        sourceId,
        data: {},
      },
    });

    // Set as active card if none exists
    const source = await prisma.source.findUnique({
      where: { id: sourceId },
      select: { activeCardId: true },
    });

    if (!source?.activeCardId) {
      await prisma.source.update({
        where: { id: sourceId },
        data: { activeCardId: card.id },
      });
    }

    return {
      data: card,
      done: true,
      error: null,
    };
  } catch (error) {
    console.error("Error creating image card:", error);
    return {
      data: null,
      done: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while creating the image card",
    };
  }
}

export async function updateImageCard(
  store: Partial<ImageCardState>,
  guildId: string,
): Promise<{
  data: ImageCard | null;
  done: boolean;
  error: string | null;
}> {
  const cardId = store.id;
  const sourceId = store.sourceId;

  if (!cardId) {
    return {
      data: null,
      done: false,
      error: "You need to select a card",
    };
  }

  if (!sourceId) {
    return {
      data: null,
      done: false,
      error: "You need to select a source",
    };
  }

  const guild = await getUserGuild(guildId);
  if (!guild) {
    return {
      data: null,
      done: false,
      error: "You do not have permission to manage this guild",
    };
  }

  if (!store.data) {
    return {
      data: null,
      done: false,
      error: "Card data cannot be null",
    };
  }

  try {
    const card = await prisma.imageCard.update({
      where: { id: cardId },
      data: {
        data: store.data as object,
      },
    });

    revalidatePath(`/dashboard/${guildId}`);
    return {
      data: card,
      done: true,
      error: null,
    };
  } catch (error) {
    console.error("Error updating image card:", error);
    return {
      data: null,
      done: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while updating the image card",
    };
  }
}

export async function deleteActiveImageCard(
  sourceId: number,
  guildId: string,
): Promise<{
  done: boolean;
  error: string | null;
}> {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    return {
      done: false,
      error: "You do not have permission to manage this guild",
    };
  }

  try {
    const source = await prisma.source.findUnique({
      where: { id: sourceId },
      select: { activeCardId: true },
    });

    if (!source?.activeCardId) {
      return {
        done: false,
        error: "No active card to delete",
      };
    }

    await deleteImageCard(source.activeCardId, guildId);

    revalidatePath(`/dashboard/${guildId}`);
    return {
      done: true,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting active image card:", error);
    return {
      done: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the active image card",
    };
  }
}

export async function deleteImageCard(
  cardId: number,
  guildId: string,
): Promise<{
  done: boolean;
  error: string | null;
}> {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    return {
      done: false,
      error: "You do not have permission to manage this guild",
    };
  }

  try {
    await prisma.imageCard.delete({
      where: { id: cardId },
    });

    revalidatePath(`/dashboard/${guildId}`);
    return {
      done: true,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting image card:", error);
    return {
      done: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while deleting the image card",
    };
  }
}
