export const convertWeiToEth = (wei: number): number => {
    if(wei === 0)
        return 0;

    return wei / 1000000000000000000;
}