import { Client, Intents } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

export interface IDiscordCommandListener {
    getOptions(interaction: any): { [key: string]: any };
    onExecute(interaction: any, options: { [key: string]: any }): void;
}

export interface IDiscordCommand {
    command: any,
    listener: IDiscordCommandListener
}

export async function createClient(token: string, clientId: string, commands: IDiscordCommand[]): Promise<void> {
    if(!token || token === '')
        throw new Error('Token cannot be empty');
    if(!clientId || clientId === '')
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
            comm[0].listener.onExecute(interaction, comm[0].listener.getOptions(interaction));
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
}