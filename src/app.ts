import { config } from 'dotenv';
import mongoose from 'mongoose';
import { createAlchemy } from "./integrations/alchemy.integration";
import { createClient } from "./integrations/discord.integration";
import { FollowCommandService } from "./services/follow-command.service";
import { ListenerService } from './services/listener.service';
import { UnfollowCommandService } from './services/unfollow-command.service';

config();

async function init() {
    await mongoose.connect(process.env['MONGO_CONNECTION_URL'] as string);
    const alchemy = createAlchemy(process.env['ALCHEMY_URL'] as string);
    const discordClient = await createClient(process.env['DISCORD_TOKEN'] as string, process.env['DISCORD_CLIENT_ID'] as string, [
        FollowCommandService.getCommandObject(),
        UnfollowCommandService.getCommandObject()
    ]);

    await ListenerService.startListener(alchemy, discordClient);

    console.log('Successfully Initialized');
}

init();

