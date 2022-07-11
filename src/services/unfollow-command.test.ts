import { Wallet } from "../models/wallet.model";
import { setupConnection } from "../utils/tests.util";
import { UnfollowCommandService } from "./unfollow-command.service";

describe('Unfollow Wallet Command', () => {

    setupConnection();
    let interactionSpy: any;

    beforeEach(async () => {
        const wallet1 = new Wallet({ address: '123', channelId: '1', createdBy: '1' });
        const wallet2 = new Wallet({ address: '1234', channelId: '1', createdBy: '1', label: 'myWallet' });

        await wallet1.save();
        await wallet2.save();
    });

    beforeEach(() => {
        interactionSpy = {
            deferReply: jest.fn(() => Promise.resolve),
            editReply: jest.fn(() => Promise.resolve),
        };
    });

    test('getCommandObject should have the right name', () => {
        const follow = UnfollowCommandService.getCommandObject();

        expect(follow.command.name).toBe('unfollowwallet');
        expect(follow.listener).toBeDefined();
    });

    test('Should display error "No subscription found for "123456"', async () => {
        const command = UnfollowCommandService.getCommandObject();

        await command.listener.onExecute(interactionSpy, { identifier: '123456' }, { channelId: '1', userId: '1' });

        expect(interactionSpy.deferReply).toBeCalled();
        expect(interactionSpy.editReply).toBeCalledWith('No subscription found for "123456"');
    });

    test('Should display error "No subscription found for "myWallet2"', async () => {
        const command = UnfollowCommandService.getCommandObject();

        await command.listener.onExecute(interactionSpy, { identifier: 'myWallet2' }, { channelId: '1', userId: '1' });

        expect(interactionSpy.deferReply).toBeCalled();
        expect(interactionSpy.editReply).toBeCalledWith('No subscription found for "myWallet2"');
    });

    test('Should unfollow from address', async () => {
        const command = UnfollowCommandService.getCommandObject();

        await command.listener.onExecute(interactionSpy, { identifier: '1234' }, { channelId: '1', userId: '1' });

        expect(interactionSpy.deferReply).toBeCalled();
        expect(interactionSpy.editReply).toBeCalledWith('Successfully unsubscribed');
    });

    test('Should unfollow from label', async () => {
        const command = UnfollowCommandService.getCommandObject();

        await command.listener.onExecute(interactionSpy, { identifier: 'myWallet' }, { channelId: '1', userId: '1' });

        expect(interactionSpy.deferReply).toBeCalled();
        expect(interactionSpy.editReply).toBeCalledWith('Successfully unsubscribed');
    });
});