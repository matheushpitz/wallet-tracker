import exp from 'constants';
import { createClient } from './discord.integration';

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
});