"use server";

import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";

import { ImageCard, Source, SourceType } from "@/prisma/generated/client";
import { ImageState } from "@/state/image";
import { SourceState } from "@/state/source";
import {
  createSource as createSourceRequest,
  deleteSource,
  getSource,
  getSourceCards,
  getUserGuild,
} from "./dal";
import prisma from "./prisma";
import { deleteSession } from "./session";
import { MessageSchema } from "./validator";
import { MessageBuilder, ValidationError } from "@discordjs/builders";
import z from "zod";
import { formatDiscordMessage } from "@/lib/utils";

export async function signIn() {
  redirect("/api/auth/login");
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}

export async function createSource(
  guildId: string,
  source: SourceType
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
    revalidatePath(`/dashboard/${guildId}/${source.toLowerCase().slice(0, -1)}`);
}

export async function removeSource(
  guildId: string,
  sourceId: number,
  sourceType: SourceType
): Promise<void> {
  const guild = await getUserGuild(guildId);
  if (!guild) {
    throw new Error("You do not have permission to manage this guild");
  }
  await deleteSource(guildId, sourceId);
  revalidatePath(
    `/dashboard/${guildId}/${sourceType.toLowerCase().slice(0, -1)}`
  );
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

  
  try{
    new MessageBuilder(formatDiscordMessage(store.message)).toJSON();
  }
  catch (e) {
    if (e instanceof ValidationError) {
      console.log("Validation error details:", e.name);
      console.log(e.cause)
      
      // return error and format message correctly to be user friendly
      return {
        data: null,
        done: false,
        error: z.prettifyError(e.cause)
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

    revalidatePath(
      `/dashboard/${guildId}/${res.type.toLowerCase().slice(0, -1)}`
    );
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
