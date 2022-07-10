import { config } from 'dotenv';
import { createAlchemy } from "./integrations/alchemy.integration";
import { createClient } from "./integrations/discord.integration";
import { FollowCommandService } from "./services/follow-command.service";
import { UnfollowCommandService } from './services/unfollow-command.service';

config();

async function init() {
    const alchemy = createAlchemy(process.env['ALCHEMY_URL'] as string);
    const discordClient = await createClient(process.env['DISCORD_TOKEN'] as string, process.env['DISCORD_CLIENT_ID'] as string, [
        FollowCommandService.getCommandObject(),
        UnfollowCommandService.getCommandObject()
    ]);

    console.log('Successfully Initialized');
}

init();

