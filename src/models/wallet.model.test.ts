import { setupConnection } from "../utils/tests.util";
import { Wallet } from "./wallet.model";

describe('Wallet model', () => {

    setupConnection();

    beforeEach(async () => {
        const wallet1 = new Wallet({ address: '123', channelId: '1', createdBy: '1' });
        const wallet2 = new Wallet({ address: '1234', channelId: '1', createdBy: '1', label: 'myWallet' });

        await wallet1.save();
        await wallet2.save();
    });

    test('findByAddressAndChannel should return 1 element', async () => {
        const result = await Wallet.findByAddressAndChannel('123', '1');

        expect(result.length).toBe(1);

        const element = result[0];

        expect(element._id).toBeDefined();
        expect(element.address).toBe('123');
        expect(element.channelId).toBe('1');
        expect(element.createdBy).toBe('1');
        expect(element.label).toBeUndefined();
    });

    test('findByLabelAndChannel should return 1 element', async () => {
        const result = await Wallet.findByLabelAndChannel('myWallet', '1');

        expect(result.length).toBe(1);

        const element = result[0];

        expect(element._id).toBeDefined();
        expect(element.address).toBe('1234');
        expect(element.channelId).toBe('1');
        expect(element.createdBy).toBe('1');
        expect(element.label).toBe('myWallet');
    });

    test('findByIdentifierAndChannel using address should return 1 element', async () => {
        const result = await Wallet.findByIdentifierAndChannel('123', '1');

        expect(result.length).toBe(1);

        const element = result[0];

        expect(element._id).toBeDefined();
        expect(element.address).toBe('123');
        expect(element.channelId).toBe('1');
        expect(element.createdBy).toBe('1');
        expect(element.label).toBeUndefined();
    });

    test('findByIdentifierAndChannel using label should return 1 element', async () => {
        const result = await Wallet.findByIdentifierAndChannel('myWallet', '1');

        expect(result.length).toBe(1);

        const element = result[0];

        expect(element._id).toBeDefined();
        expect(element.address).toBe('1234');
        expect(element.channelId).toBe('1');
        expect(element.createdBy).toBe('1');
        expect(element.label).toBe('myWallet');
    });

    test('findAllAddresses should return all addresses', async () => {
        const result = await Wallet.findAllAddresses();

        expect(result.length).toBe(2);

        const element = result[0];

        expect(element._id).toBeDefined();
        expect(element.address).toBeDefined();
        expect(element.channelId).toBeUndefined();
        expect(element.createdBy).toBeUndefined();
        expect(element.label).toBeUndefined();
    });

    test('findChannelAndLabelByAddress should return 1 element', async () => {
        const result = await Wallet.findChannelAndLabelByAddress('1234');

        expect(result.length).toBe(1);

        const element = result[0];

        expect(element._id).toBeDefined();
        expect(element.address).toBeUndefined();
        expect(element.channelId).toBe('1');
        expect(element.createdBy).toBeUndefined();
        expect(element.label).toBe('myWallet');
    });
});