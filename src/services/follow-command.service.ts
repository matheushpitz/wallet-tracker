import { SlashCommandBuilder } from "@discordjs/builders";
import { IDiscordCommand, IDiscordCommandListener, IDiscordMessageData } from "../integrations/discord.integration";
import { Wallet } from "../models/wallet.model";

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
        const { channelId, userId } = messageData;
        const { address, label } = options;

        await interaction.deferReply();

        if(address === label) {
            await interaction.editReply('Address and label must be different');
            return;
        }

        let result = await Wallet.findByAddressAndChannel(address, channelId);
        if(result.length) {
            await interaction.editReply('This channel is already subscribed to this address');
            return;
        }

        if(label) {
            result = await Wallet.findByLabelAndChannel(label, channelId);
            if(result.length) {
                await interaction.editReply(`The label ${label} already exists on this channel.`);
                return;
            }
        }

        const model = new Wallet({
            address,
            channelId,
            createdBy: userId,
            label
        });

        try {
            await model.save();
            await interaction.editReply(`Successfully subscribed to ${address}.`);
        } catch(err) {
            console.error('Error when trying to save wallet', err);
        }
    }
}