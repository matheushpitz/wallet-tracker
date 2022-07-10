import { Client, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

export interface IDiscordMessageData {
    channelId: string,
    userId: string
}

export interface IDiscordCommandListener {
    getOptions(interaction: any): { [key: string]: any };
    onExecute(interaction: any, options: { [key: string]: any }, messageData: IDiscordMessageData): void;
}

export interface IDiscordCommand {
    command: any,
    listener: IDiscordCommandListener
}

export class DiscordClient {
    constructor(private client: any) {

    }

    public sendMessageToChannel(channelId: string, message: string) {
        if(!channelId || !channelId.length)
            throw new Error('channelId cannot be empty');

        const channel = this.client.channels.cache.find((channel: any) => channel.id === channelId);

        if(channel)
            channel.send(message);
    }
}

export async function createClient(token: string, clientId: string, commands: IDiscordCommand[]): Promise<DiscordClient> {
    if(!token || !token.length)
        throw new Error('Token cannot be empty');
    if(!clientId || !clientId.length)
        throw new Error('clientId cannot be empty');

    const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

    client.once('ready', () => {
        console.log('Discord Client is ready');
    });

    client.on('interactionCreate', async (interaction: any) => {
        if(!interaction.isCommand()) {
            return;
        }

        const comm = commands.filter(c => c.command.name === interaction.commandName);
        if(comm.length > 0) {
            comm[0].listener.onExecute(interaction, comm[0].listener.getOptions(interaction), {
                channelId: interaction.channelId,
                userId: interaction.user.id
            });
        }
    });

    client.login(token);

    try {
        const dCommands = commands.map(c => c.command.toJSON());
        const rest = new REST({ version: '10' }).setToken(token);

        await rest.put(Routes.applicationCommands(clientId), { body: commands });

        console.log('Discord commands were registered successfully');
    } catch(err) {
        console.error('error while registering discord commands', err);
        throw err;
    }

    return new DiscordClient(client);
}