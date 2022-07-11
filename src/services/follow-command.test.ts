import { Wallet } from "../models/wallet.model";
import { setupConnection } from "../utils/tests.util";
import { FollowCommandService } from "./follow-command.service";

describe('Follow Wallet Command', () => {

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
        const follow = FollowCommandService.getCommandObject();

        expect(follow.command.name).toBe('followwallet');
        expect(follow.listener).toBeDefined();
    });

    test('Should display error "label and address must be different"', async () => {
        const command = FollowCommandService.getCommandObject();

        await command.listener.onExecute(interactionSpy, { address: '123', label: '123' }, { channelId: '1', userId: '1' });

        expect(interactionSpy.deferReply).toBeCalled();
        expect(interactionSpy.editReply).toBeCalledWith('Address and label must be different');
    });

    test('Should display error "This channel is already subscribed to this address"', async () => {
        const command = FollowCommandService.getCommandObject();

        await command.listener.onExecute(interactionSpy, { address: '123' }, { channelId: '1', userId: '1' });

        expect(interactionSpy.deferReply).toBeCalled();
        expect(interactionSpy.editReply).toBeCalledWith('This channel is already subscribed to this address');
    });

    test('Should display error "The label myWallet already exists on this channel."', async () => {
        const command = FollowCommandService.getCommandObject();

        await command.listener.onExecute(interactionSpy, { address: '12345', label: 'myWallet' }, { channelId: '1', userId: '1' });

        expect(interactionSpy.deferReply).toBeCalled();
        expect(interactionSpy.editReply).toBeCalledWith('The label myWallet already exists on this channel.');
    });

    test('Should subscribe', async () => {
        const command = FollowCommandService.getCommandObject();

        await command.listener.onExecute(interactionSpy, { address: '123456', label: 'myWallet2' }, { channelId: '1', userId: '1' });

        expect(interactionSpy.deferReply).toBeCalled();
        expect(interactionSpy.editReply).toBeCalledWith('Successfully subscribed to 123456.');

        const result = await Wallet.findByAddressAndChannel('123456', '1');

        expect(result.length).toBe(1);

        const element = result[0];
        expect(element.address).toBe('123456');
        expect(element.channelId).toBe('1');
        expect(element.createdBy).toBe('1');
        expect(element.label).toBe('myWallet2');
    });
});