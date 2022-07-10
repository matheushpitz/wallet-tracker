import { SlashCommandBuilder } from "@discordjs/builders";
import { IDiscordCommand, IDiscordCommandListener, IDiscordMessageData } from "../integrations/discord.integration";

export class FollowCommandService implements IDiscordCommandListener {

    static getCommandObject(): IDiscordCommand {
        return {
            command: new SlashCommandBuilder()
                            .setName('followwallet').setDescription('Subscribe to wallet')
                            .addStringOption((o: any) => o.setName('address').setDescription('Wallet\' address to subscribe to').setRequired(true))
                            .addStringOption((o: any) => o.setName('label').setDescription('Label to identify the wallet').setRequired(false)),
            listener: new FollowCommandService()
        }
    }

    constructor() {

    }

    getOptions(interaction: any): { [key: string]: any; } {
        return {
            address: interaction.options.getString('address'),
            label: interaction.options.getString('label')
        };
    }

    async onExecute(interaction: any, options: { [key: string]: any; }, messageData: IDiscordMessageData): Promise<void> {
        await interaction.reply(` address: ${options.address} label: ${options.label} channelId: ${messageData.channelId} userId: ${messageData.userId}`);
    }
}