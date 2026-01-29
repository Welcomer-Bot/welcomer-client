import { REST } from '@discordjs/rest';

const RestClientSingleton = () => {
    return new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);
};

declare const globalThis: {
    restGlobal: ReturnType<typeof RestClientSingleton>;
} & typeof global;

const rest = globalThis.restGlobal ?? RestClientSingleton();

export default rest;

if (process.env.NODE_ENV !== "production") globalThis.restGlobal = rest;