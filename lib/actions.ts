"use server";

import { Leaver, Welcomer } from "@/lib/discord/schema";
import { redirect } from "next/navigation";

import { BaseCardParams } from "@/lib/discord/schema";
import { CompleteEmbed, CompleteEmbedField } from "@/prisma/schema";
import { ImageStore } from "@/state/image";
import { ModuleName } from "@/types";

import { revalidatePath } from "next/cache";
import {
  createEmbed,
  createImageCard,
  createLeaver,
  createWelcomer,
  deleteCard,
  deleteCardText,
  deleteEmbed,
  deleteEmbedField,
  deleteLeaver,
  deleteWelcomer,
  getEmbeds,
  getLeaver,
  getModuleCards,
  getUserGuild,
  getWelcomer,
  updateEmbed,
  updateImageCard,
  updateImageCardText,
  updateLeaver,
  updateLeaverChannelAndContent,
  updateWelcomer,
  updateWelcomerChannelAndContent,
} from "./dal";

import { deleteSession } from "./session";
import { MessageSchema } from "./validator";

export async function signIn() {
  redirect("/api/auth/login");
}

export async function signOut() {
  await deleteSession();
  redirect("/");
}

export async function createModule(
  guildId: string,
  moduleName: ModuleName
): Promise<void> {
  if (!(await getUserGuild(guildId))) {
    throw new Error("You do not have permission to manage this guild");
  }
  if (moduleName === "welcomer") {
    await createWelcomer(guildId);
  } else if (moduleName === "leaver") {
    await createLeaver(guildId);
  } else {
    throw new Error("Invalid module name");
  }

  revalidatePath(`/app/dashboard/${guildId}/welcome`);
}
export async function updateModule(
  store: (Welcomer | Leaver) & {
    deletedEmbeds: CompleteEmbed[];
    deletedFields: CompleteEmbedField[];
  },
  moduleName: ModuleName | null
) {
  const guildId = store.guildId;
  if (!guildId) {
    return {
      error: "You need to select a guild",
    };
  }
  if (!(await getUserGuild(guildId))) {
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
  try {
    if (moduleName === "welcomer") {
      await updateWelcomerChannelAndContent(
        guildId,
        store.channelId,
        store.content
      );
    } else if (moduleName === "leaver") {
      await updateLeaverChannelAndContent(
        guildId,
        store.channelId,
        store.content
      );
    } else {
      return {
        error: "Invalid module name",
      };
    }

    const embeds = await getEmbeds(guildId, moduleName);
    const embedsToCreate = store.embeds.filter((embed) => embed.id === null);
    const embedsToDelete = store.deletedEmbeds.filter(
      (embed) => embed.id !== null
    );
    if (
      (embeds?.length ?? 0) + embedsToCreate.length - embedsToDelete.length >
      10
    )
      return {
        error: "You cannot have more than 10 embeds",
      };
    for (const embed of store.embeds) {
      if (
        embed.id &&
        embed[`${moduleName}Id`] &&
        guildId != embed[`${moduleName}Id`]
      )
        return {
          error: "You cannot update an embed that is not in the module",
        };
      if (embeds && embed && embed.id && embed === embeds[embed.id]) continue;
      const embedUpdated = await createOrUpdateEmbed(
        embed,
        guildId,
        moduleName
      );
      if (!embedUpdated) {
        return {
          error: "An error occurred while updating the module",
        };
      }
    }

    for (const embed of store.deletedEmbeds) {
      if (embed.id) {
        if (embed[`${moduleName}Id`] && guildId != embed[`${moduleName}Id`])
          return {
            error: "You cannot delete an embed that is not in the module",
          };
        await deleteEmbed(embed.id, moduleName, guildId);
      }
    }
    for (const field of store.deletedFields) {
      if (field.id) {
        if (field.embedId && !(field.embedId in store.embeds))
          return {
            error: "You cannot delete a field that is not in the embed",
          };
        await deleteEmbedField(field.id);
      }
    }

    console.log("store.activeCardToEmbedId", store.activeCardToEmbedId);
    if (store.activeCard && store.activeCardToEmbedId !== null) {
      if (store.activeCardToEmbedId === -2) {
        if (moduleName === "welcomer") {
          await updateWelcomer(
            guildId,

            {
              activeCard: {
                disconnect: true,
              },
              activeCardToEmbed: {
                disconnect: true,
              },
            }
          );
        }
        else if (moduleName === "leaver") {
          await updateLeaver(
            guildId,

            {
              activeCard: {
                disconnect: true,
              },
              activeCardToEmbed: {
                disconnect: true,
              },
            }
          );
        }
      } else if (store.activeCardToEmbedId === -1) {
        if (moduleName === "welcomer") {
          await updateWelcomer(guildId, {
            activeCardToEmbed: {
              disconnect: true,
              // set to -1 to show on the bottom
            },
          });
        }
        else if (moduleName === "leaver") {
          await updateLeaver(
            guildId,

            {
              activeCardToEmbed: {
                disconnect: true,
              },
            }
          );
        }
      } else {
        const embedId =
          store.activeCardToEmbedId !== undefined && store.activeCardToEmbedId !== null &&
          store.embeds[store.activeCardToEmbedId]?.id;
        // console.log("embedId", embedId);
        if (!embedId)
          return {
            error: "You need to select an embed to be the active one",
          };
        if (moduleName === "welcomer") {
          await updateWelcomer(guildId, {
            activeCardToEmbed: {
              connect: {
                id: embedId,
              },
            },
          });
        } else if (moduleName === "leaver") {
          await updateLeaver(
            guildId,

            {
              activeCardToEmbed: {
                connect: {
                  id: embedId,
                },
              },
            }
          );
        }
      }
    }
    revalidatePath(`/app/dashboard/${guildId}/welcome`);
    return {
      done: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "An error occurred while updating the welcomer module",
    };
  }
}

export async function createOrUpdateEmbed(
  embed: CompleteEmbed,
  moduleId: string,
  moduleType: "welcomer" | "leaver"
): Promise<CompleteEmbed | null> {
  let embedDb;
  const createOrUpdateAuthor = {
    author: embed.author?.name
      ? {
          upsert: {
            where: {
              embedId: embed.id,
            },
            update: {
              name: embed.author?.name,
              iconUrl: embed.author?.iconUrl,
              url: embed.author?.url,
            },
            create: {
              id: embed.id,
              name: embed.author?.name,
              iconUrl: embed.author?.iconUrl,
              url: embed.author?.url,
            },
          },
        }
      : undefined,
  };

  const createOrUpdateFooter = {
    footer: embed.footer?.text
      ? {
          upsert: {
            where: {
              embedId: embed.id,
            },
            update: {
              text: embed.footer?.text,
              iconUrl: embed.footer?.iconUrl,
            },
            create: {
              id: embed.id,
              text: embed.footer?.text,
              iconUrl: embed.footer?.iconUrl,
            },
          },
        }
      : undefined,
  };

  const createOrUpdateFields = {
    fields: {
      upsert: embed.fields.map((field) => ({
        where: {
          embedId: embed.id,
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
  };

  const createAuthor = {
    author: embed.author?.name
      ? {
          create: {
            name: embed.author?.name,
            iconUrl: embed.author?.iconUrl,
            url: embed.author?.url,
          },
        }
      : undefined,
  };

  const createFooter = {
    footer: embed.footer?.text
      ? {
          create: {
            text: embed.footer?.text,
            iconUrl: embed.footer?.iconUrl,
          },
        }
      : undefined,
  };

  const createFields = {
    fields: {
      create: embed.fields.map((field) => ({
        name: field.name,
        value: field.value,
        inline: field.inline,
      })),
    },
  };

  try {
    if (embed.id) {
      embedDb = await updateEmbed(embed.id, moduleType, moduleId, {
        title: embed.title,
        description: embed.description,
        color: embed.color,
        timestamp: embed.timestamp,
        ...createOrUpdateAuthor,
        ...createOrUpdateFooter,
        ...createOrUpdateFields,
      });
    } else {
      embedDb = await createEmbed({
        [`${moduleType}Id`]: moduleId,
        title: embed.title,
        description: embed.description,
        color: embed.color,
        timestamp: embed.timestamp,
        ...createAuthor,
        ...createFooter,
        ...createFields,
      });
    }
    return embedDb as CompleteEmbed;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function removeModule(
  guildId: string,
  moduleName: ModuleName
): Promise<boolean> {
  if (!(await getUserGuild(guildId))) {
    throw new Error("You do not have permission to manage this guild");
  }
  try {
    if (moduleName === "welcomer") {
      await deleteWelcomer(guildId);
    } else if (moduleName === "leaver") {
      await deleteLeaver(guildId);
    } else {
      throw new Error("Invalid module");
    }

    revalidatePath(`/app/dashboard/${guildId}/welcome`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function updateCards(
  currentStore: Partial<ImageStore>,
  moduleName: ModuleName | null
): Promise<{
  store?: Partial<ImageStore> | null;
  done: boolean;
  error: string | null;
}> {
  // try {
  const store = currentStore;
  const moduleId = store.moduleId;
  if (!moduleId) {
    throw new Error("You need to select a module");
  }

  if (!moduleName) {
    throw new Error("Invalid module name");
  }
  const cardsDb = await getModuleCards(moduleId, moduleName);
  const welcomeOrLeaveModule =
    moduleName === "welcomer"
      ? await getWelcomer(moduleId)
      : await getLeaver(moduleId);
  if (!welcomeOrLeaveModule) {
    throw new Error("You need to enable the module first");
  }
  const guildId = welcomeOrLeaveModule.guildId;
  if (!guildId || !(await getUserGuild(guildId))) {
    throw new Error("You do not have permission to manage this guild");
  }
  const cardsToCreate =
    store.imageCards?.filter((card) => card.id === null) ?? [];
  if ((cardsDb?.length ?? 0) + cardsToCreate.length > 5)
    throw new Error("You cannot have more than 5 cards");

  for (const card of store.removedCard ?? []) {
    if (card.id) {
      const deletedCard = await deleteCard(card.id);

      if (deletedCard) {
        store.removedCard?.splice(store.removedCard.indexOf(card), 1);
      }
    }
  }

  for (const text of store.removedText ?? []) {
    if (text.id) {
      await deleteCardText(text.id);
      store.removedText?.splice(store.removedText.indexOf(text), 1);
    }
  }
  const cards = [];
  if (store.imageCards) {
    for (const card of store.imageCards) {
      const cardUpdated = await createOrUpdateCard(card, moduleId, moduleName);
      if (!cardUpdated) {
        throw new Error("An error occurred while updating the image module");
      }
      cards.push(cardUpdated);
    }
    // set active card
    if (store.activeCard !== null && store.activeCard !== undefined) {
      const id = cards[store.activeCard]?.id;

      if (!id)
        throw new Error(
          "You need to select an image card to be the active one"
        );
      if (moduleName === "welcomer") {
        await updateWelcomer(guildId, {
          activeCard: {
            connect: {
              id: id,
            },
          },
        });
      } else if (moduleName === "leaver") {
        await updateLeaver(guildId, {
          activeCard: {
            connect: {
              id: id,
            },
          },
        });
      }
    } else {
      if (moduleName === "welcomer") {
        await updateWelcomer(guildId, {
          activeCard: {
            disconnect: true,
          },
          activeCardToEmbed: {
            disconnect: true,
          },
        });
      } else if (moduleName === "leaver") {
        await updateLeaver(guildId, {
          activeCard: {
            disconnect: true,
          },
          activeCardToEmbed: {
            disconnect: true,
          },
        });
      }
    }
  }

  revalidatePath(`/app/dashboard/${guildId}/welcome/image`);

  return {
    store: {
      imageCards: cards,
    },
    done: true,
    error: null,
  };
  // } catch (error) {
  //   console.log(error);
  //   if (error instanceof Error) {
  //     return {
  //       done: false,
  //       error: error.message,
  //     };
  //   }

  //   return {
  //     done: false,
  //     error: "An error occurred while updating the image module",
  //   };
  // }
}

export async function createOrUpdateCard(
  card: BaseCardParams,
  moduleId: string,
  moduleName: ModuleName
): Promise<BaseCardParams | null> {
  let cardDb;
  const connectOrCreateMainText = card.mainText
    ? {
        mainText: {
          connectOrCreate: {
            where: {
              id: card.mainText?.id ?? -1,
            },
            create: {
              content: card.mainText.content,
              color: card.mainText?.color,
              font: card.mainText?.font,
            },
          },
        },
      }
    : {};

  const connectOrCreateSecondText = card.secondText
    ? {
        secondText: {
          connectOrCreate: {
            where: {
              id: card.secondText?.id ?? -1,
            },
            create: {
              content: card.secondText!.content,
              color: card.secondText?.color,
              font: card.secondText?.font,
            },
          },
        },
      }
    : {};

  const connectOrCreateNicknameText = card.nicknameText
    ? {
        nicknameText: {
          connectOrCreate: {
            where: {
              id: card.nicknameText?.id ?? -1,
            },
            create: {
              content: card.nicknameText!.content,
              color: card.nicknameText?.color,
              font: card.nicknameText?.font,
            },
          },
        },
      }
    : {};

  if (card.mainText?.id) {
    await updateImageCardText(card.mainText.id, card.mainText);
  }

  if (card.secondText?.id) {
    await updateImageCardText(card.secondText.id, card.secondText);
  }

  if (card.nicknameText?.id) {
    await updateImageCardText(card.nicknameText.id, card.nicknameText);
  }

  // try {
  if (card.id) {
    cardDb = await updateImageCard(card.id, {
      [moduleName]: {
        connect: {
          guildId: moduleId,
        },
      },
      backgroundImgURL: card.backgroundImgURL,
      backgroundColor:
        typeof card.backgroundColor === "string"
          ? card.backgroundColor
          : undefined,
      avatarBorderColor: card.avatarBorderColor,
      ...connectOrCreateMainText,
      ...connectOrCreateSecondText,
      ...connectOrCreateNicknameText,
    });
  } else {
    cardDb = await createImageCard({
      [moduleName]: {
        connect: {
          guildId: moduleId,
        },
      },
      backgroundImgURL: card.backgroundImgURL,
      backgroundColor:
        typeof card.backgroundColor === "string"
          ? card.backgroundColor
          : undefined,
      avatarBorderColor: card.avatarBorderColor,
      ...connectOrCreateMainText,
      ...connectOrCreateSecondText,
      ...connectOrCreateNicknameText,
    });
  }
  return {
    ...(cardDb as BaseCardParams),
  };
  // } catch (error) {
  //   console.error(error);
  //   return null;
  // }
}
