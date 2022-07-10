import { UnfollowCommandService } from "./unfollow-command.service";

describe('Unfollow Wallet Command', () => {
    test('getCommandObject should have the right name', () => {
        const follow = UnfollowCommandService.getCommandObject();

        expect(follow.command.name).toBe('unfollowwallet');
        expect(follow.listener).toBeDefined();
    })
});