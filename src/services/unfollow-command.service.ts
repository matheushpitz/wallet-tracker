import { SlashCommandBuilder } from "@discordjs/builders";
import { IDiscordCommand, IDiscordCommandListener, IDiscordMessageData } from "../integrations/discord.integration";

export class UnfollowCommandService implements IDiscordCommandListener {

    static getCommandObject(): IDiscordCommand {
        return {
            command: new SlashCommandBuilder()
                            .setName('unfollowwallet').setDescription('Unsubscribe from wallet')
                            .addStringOption((o: any) => o.setName('identifier').setDescription('Address or label of the wallet to be unsubscribed').setRequired(true)),
            listener: new UnfollowCommandService()
        }
    }

    constructor() {

    }

    getOptions(interaction: any): { [key: string]: any; } {
        return {
            identifier: interaction.options.getString('identifier')
        };
    }

    async onExecute(interaction: any, options: { [key: string]: any; }, messageData: IDiscordMessageData): Promise<void> {
        await interaction.reply(` identifier: ${options.identifier} channelId: ${messageData.channelId} userId: ${messageData.userId}`);
    }
}