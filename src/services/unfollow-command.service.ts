import { SlashCommandBuilder } from "@discordjs/builders";
import { IDiscordCommand, IDiscordCommandListener, IDiscordMessageData } from "../integrations/discord.integration";
import { Wallet } from "../models/wallet.model";

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
        const { channelId, userId } = messageData;
        const { identifier } = options;

        await interaction.deferReply();

        let result = await Wallet.findByIdentifierAndChannel(identifier, channelId);
        if(!result.length) {
            await interaction.editReply(`No subscription found for "${identifier}"`);
            return;
        }

        try {
            await Wallet.deleteMany({ _id: { $in: result.map(x => x._id) } });
            await interaction.editReply(`Successfully unsubscribed`);
        } catch(err) {
            console.error('Error when trying to unsubscribe wallet', err);
        }
    }
}