import { convertWeiToEth } from "./etherium.util";

describe('Ethereum Utils', () => {
    describe('Convert WEI to ETH', () => {
        test('0 WEI should be 0 ETH', () => {
            expect(convertWeiToEth(0)).toBe(0);
        });

        test('5000000000000 WEI should be 0.000005 ETH', () => {
            expect(convertWeiToEth(5000000000000)).toBe(0.000005);
        });

        test('15000000000000000000 WEI should be 15 ETH', () => {
            expect(convertWeiToEth(15000000000000000000)).toBe(15);
        });
    });
});