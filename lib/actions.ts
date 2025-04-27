"use server";

import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";

import { ImageState } from "@/state/image";
import { SourceState } from "@/state/source";
import { Source, SourceType } from "@prisma/client";
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
  await createSourceRequest(guild.id, source);
  revalidatePath(
    `/dashboard/${guildId}/${source.toLowerCase().slice(0, -1)}`
  );
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

export async function updateSource(store: SourceState) {
  const guildId = store.guildId;
  const sourceId = store.id;
  console.log("store", store);
  if (!guildId) {
    return {
      error: "You need to select a guild",
    };
  }
  if (!sourceId) {
    return {
      error: "You need to select a source",
    };
  }
  const guild = await getUserGuild(guildId);
  if (!guild) {
    return {
      error: "You do not have permission to manage this guild",
    };
  }
  if (!store.channelId) {
    return {
      error: "You need to select a channel",
    };
  }
  const messageValidated = MessageSchema.safeParse(store);
  if (!messageValidated.success) {
    return {
      error: messageValidated.error.errors[0].path[-1]
        ? messageValidated.error.errors[0].path[-1] + ": "
        : "" + messageValidated.error.errors[0].message,
    };
  }
  const source = await getSource(guildId, sourceId);
  if (!source) {
    return {
      error: "This source does not exist",
    };
  }

  const embedsToCreate = store.embeds.filter((embed) => embed.id == undefined);
  const embedsToDelete = store.deletedEmbeds.filter(
    (embed) => embed.id != undefined
  );
  const embedsToUpdate = store.embeds.filter((embed) => embed.id != undefined);

  const res = await prisma.source.update({
    where: {
      id: sourceId,
    },
    data: {
      channelId: store.channelId,
      content: store.content,
      embeds: {
        create: embedsToCreate.map((embed) => ({
          title: embed.title,
          description: embed.description,
          color: embed.color,
          timestamp: embed.timestamp,
          author: embed.author
            ? {
                create: {
                  name: embed.author.name,
                  iconUrl: embed.author.iconUrl,
                  url: embed.author.url,
                },
              }
            : undefined,
          footer: embed.footer
            ? {
                create: {
                  text: embed.footer.text,
                  iconUrl: embed.footer.iconUrl,
                },
              }
            : undefined,
          fields: embed.fields
            ? {
                create: embed.fields.map((field) => ({
                  name: field.name,
                  value: field.value,
                  inline: field.inline,
                })),
              }
            : undefined,
        })),
        deleteMany: embedsToDelete.map((embed) => ({
          id: embed.id,
        })),
        update: embedsToUpdate.map((embed) => ({
          where: {
            id: embed.id,
          },
          data: {
            title: embed.title,
            description: embed.description,
            color: embed.color,
            timestamp: embed.timestamp,
            author: embed.author
              ? {
                  upsert: {
                    where: {
                      id: embed.author.id ?? -1,
                    },
                    create: {
                      name: embed.author.name,
                      iconUrl: embed.author.iconUrl,
                      url: embed.author.url,
                    },
                    update: {
                      name: embed.author.name,
                      iconUrl: embed.author.iconUrl,
                      url: embed.author.url,
                    },
                  },
                }
              : undefined,
            footer: embed.footer
              ? {
                  upsert: {
                    where: {
                      id: embed.footer.id ?? -1,
                    },
                    create: {
                      text: embed.footer.text,
                      iconUrl: embed.footer.iconUrl,
                    },
                    update: {
                      text: embed.footer.text,
                      iconUrl: embed.footer.iconUrl,
                    },
                  },
                }
              : undefined,
            fields: {
              deleteMany: store.deletedFields
                .filter((field) => field.embedId === embed.id)
                .map((field) => ({
                  id: field.id,
                })),
              upsert: embed.fields?.map((field) => ({
                where: {
                  id: field.id ?? -1,
                },
                update: {
                  name: field.name,
                  value: field.value,
                  inline: field.inline,
                },
                create: {
                  name: field.name,
                  value: field.value,
                  inline: field.inline,
                },
              })),
            },
          },
        })),
      },
      activeCard:
        store.activeCardId && store.activeCardToEmbedId !== -2
          ? {
              connect: {
                id: store.activeCardId,
              },
            }
          : {
              disconnect: true,
            },
      activeCardToEmbed:
        store.activeCardToEmbedId && store.activeCardToEmbedId >= 0
          ? {
              connect: {
                id: store.activeCardToEmbedId,
              },
            }
          : {
              disconnect: true,
            },
    },
  });

  revalidatePath(
    `/dashboard/${guildId}/${source.type.toLowerCase().slice(0, -1)}`
  );
  return {
    data: res,
    done: true,
  };
}

export async function updateCards(
  currentStore: ImageState,
  guildId: string
): Promise<{
  data: Source | null;
  done: boolean;
  error: string | null;
}> {
  try {
    const store = currentStore;
    // console.log("store", store);
    const sourceId = store.sourceId;
    if (!sourceId) {
      throw new Error("You need to select a module");
    }
    // console.log("guildId", guildId);
    const guild = await getUserGuild(guildId);
    // console.log("guild", guild);
    if (!guild) {
      throw new Error("You do not have permission to manage this guild");
    }
    const source = await getSource(guildId, sourceId);

    if (!source) {
      throw new Error("This module does not exist");
    }
    const cardsLength = (await getSourceCards(source.id))?.length ?? 0;

    // All cards except the active card, we can get the active card with selectedCard which is the index of the card in store.imageCards
    const nonActiveCard =
      store.selectedCard !== null &&
      store.imageCards[store.selectedCard] !== undefined &&
      store.imageCards[store.selectedCard].id !== undefined
        ? store.imageCards
        : store.imageCards?.filter(
            (card, index) => index !== store.selectedCard
          );
    const cardsToCreate =
      nonActiveCard?.filter((card) => card.id === undefined) ?? [];
    const cardsToDelete =
      store.removedCard?.filter((card) => card.id !== undefined) ?? [];
    const cardsToUpdate =
      nonActiveCard?.filter((card) => card.id !== undefined) ?? [];

    if (cardsLength + cardsToCreate.length > 5)
      throw new Error("You cannot have more than 5 cards");

    const res = await prisma.source.update({
      where: {
        id: sourceId,
      },
      data: {
        activeCard:
          store.selectedCard !== null &&
          store.imageCards[store.selectedCard] !== undefined
            ? {
                connectOrCreate: {
                  where: {
                    id: store.imageCards[store.selectedCard].id ?? -1,
                  },
                  create: {
                    backgroundImgURL:
                      store.imageCards[store.selectedCard].backgroundImgURL,
                    backgroundColor:
                      store.imageCards[store.selectedCard].backgroundColor ||
                      null,
                    avatarBorderColor:
                      store.imageCards[store.selectedCard].avatarBorderColor ||
                      null,
                    mainText: store.imageCards[store.selectedCard].mainText
                      ? {
                          create: {
                            content:
                              store.imageCards[store.selectedCard]?.mainText
                                ?.content ?? "",
                            color:
                              store.imageCards[store.selectedCard].mainText
                                ?.color || null,
                            font:
                              store.imageCards[store.selectedCard].mainText
                                ?.font || null,
                          },
                        }
                      : undefined,
                    secondText: store.imageCards[store.selectedCard].secondText
                      ? {
                          create: {
                            content:
                              store.imageCards[store.selectedCard].secondText
                                ?.content ?? "",
                            color:
                              store.imageCards[store.selectedCard].secondText
                                ?.color || null,
                            font:
                              store.imageCards[store.selectedCard].secondText
                                ?.font || null,
                          },
                        }
                      : undefined,
                    nicknameText: store.imageCards[store.selectedCard]
                      .nicknameText
                      ? {
                          create: {
                            content:
                              store.imageCards[store.selectedCard].nicknameText
                                ?.content ?? "",
                            color:
                              store.imageCards[store.selectedCard].nicknameText
                                ?.color || null,
                            font:
                              store.imageCards[store.selectedCard].nicknameText
                                ?.font || null,
                          },
                        }
                      : undefined,
                    Source: {
                      connect: {
                        id: sourceId,
                      },
                    },
                  },
                },
              }
            : {
                disconnect: true,
              },

        images: {
          create: cardsToCreate.map((card) => ({
            backgroundImgURL: card.backgroundImgURL,
            backgroundColor: card.backgroundColor || null,
            avatarBorderColor: card.avatarBorderColor || null,
            mainText: card.mainText
              ? {
                  create: {
                    content: card.mainText.content,
                    color: card.mainText.color || null,
                    font: card.mainText.font || null,
                  },
                }
              : undefined,
            secondText: card.secondText
              ? {
                  create: {
                    content: card.secondText.content,
                    color: card.secondText.color || null,
                    font: card.secondText.font || null,
                  },
                }
              : undefined,
            nicknameText: card.nicknameText
              ? {
                  create: {
                    content: card.nicknameText.content,
                    color: card.nicknameText.color || null,
                    font: card.nicknameText.font || null,
                  },
                }
              : undefined,
          })),
          deleteMany: cardsToDelete
            .filter((card) => card.id !== undefined)
            .map((card) => ({
              id: card.id,
            })),
          update: cardsToUpdate
            .filter((card) => card.id !== undefined)
            .map((card) => ({
              where: {
                id: card.id,
              },
              data: {
                backgroundImgURL: card.backgroundImgURL,
                backgroundColor: card.backgroundColor || null,
                avatarBorderColor: card.avatarBorderColor || null,
                mainText: card.mainText
                  ? {
                    upsert: {
                      where: {
                        id: card.mainText.id ?? -1,
                      },
                        create: {
                          content: card.mainText.content,
                          color: card.mainText.color || null,
                          font: card.mainText.font || null,
                        },
                        update: {
                          content: card.mainText.content,
                          color: card.mainText.color || null,
                          font: card.mainText.font || null,
                        },
                      },
                    }
                  : {
                      disconnect: true,
                    },
                secondText: card.secondText
                  ? {
                    upsert: {
                      where: {
                        id: card.secondText.id ?? -1,
                        },
                        create: {
                          content: card.secondText.content,
                          color: card.secondText.color || null,
                          font: card.secondText.font || null,
                        },
                        update: {
                          content: card.secondText.content,
                          color: card.secondText.color || null,
                          font: card.secondText.font || null,
                        },
                      },
                    }
                  : {
                      disconnect: true,
                    },
                nicknameText: card.nicknameText
                  ? {
                    upsert: {
                      where: {
                        id: card.nicknameText.id ?? -1,
                        },
                        create: {
                          content: card.nicknameText.content,
                          color: card.nicknameText.color || null,
                          font: card.nicknameText.font || null,
                        },
                        update: {
                          content: card.nicknameText.content,
                          color: card.nicknameText.color || null,
                          font: card.nicknameText.font || null,
                        },
                      },
                    }
                  : {
                      disconnect: true,
                    },
              },
            })),
        },
      },
    });
    revalidatePath(
      `/dashboard/${guildId}/${source.type.toLowerCase().slice(0, - 1)}`,
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
      error: "An error occurred while updating the image module",
    };
  }
}
