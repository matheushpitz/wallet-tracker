import exp from 'constants';
import { createClient, DiscordClient } from './discord.integration';

describe('Discord Integration', () => {
    describe('createClient', () => {
        test('token should not be empty', async () => {
            try {
                await createClient('', 'clientId', []);
                fail('should not resolve');
            } catch(err: any) {
                expect(err.message).toBe('Token cannot be empty');
            }
        });

        test('clientId should not be empty', async () => {
            try {
                await createClient('token', '', []);
                fail('should not resolve');
            } catch(err: any) {
                expect(err.message).toBe('clientId cannot be empty');
            }
        });
    });

    describe('DiscordClient', () => {
        test('channelId should not be empty when sending message to channel', () => {
            try {
                const dClient = new DiscordClient({});
                dClient.sendMessageToChannel('', '');
            } catch(err: any) {
                expect(err.message).toBe('channelId cannot be empty');
            }
        });
    });
});