import { FollowCommandService } from "./follow-command.service";

describe('Follow Wallet Command', () => {
    test('getCommandObject should have the right name', () => {
        const follow = FollowCommandService.getCommandObject();

        expect(follow.command.name).toBe('followwallet');
        expect(follow.listener).toBeDefined();
    })
});