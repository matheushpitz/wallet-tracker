import { AlchemyWeb3 } from "@alch/alchemy-web3";
import { DiscordClient } from "../integrations/discord.integration";
import { IWalletDocument, Wallet } from "../models/wallet.model";
import { convertWeiToEth } from "../utils/etherium.util";

export class ListenerService {
    static async startListener(alchemy: AlchemyWeb3, discord: DiscordClient): Promise<ListenerService> {
        const listener = new ListenerService(alchemy, discord);
        await listener.setup();

        return listener;
    }

    private _walletCache: { [key: string]: boolean };

    constructor(
        private alchemy: AlchemyWeb3,
        private discord: DiscordClient
    ) {
        this._walletCache = {};
    }

    private async setup(): Promise<void> {
        // start cache, this cache will be used when listening to eth.
        await this.loadCache();

        Wallet.watch<IWalletDocument>().on('change', (data) => {
            if(data.operationType === 'insert')
                this.followWallet(data.fullDocument.address);
        });

        this.alchemy.eth.subscribe('alchemy_fullPendingTransactions').on('data', async data => {
            if(data.to) {
                await this.onTransaction({
                    from: data.from,
                    to: data.to,
                    value: convertWeiToEth(parseInt(data.value, 16))
                });
            }
        });
    }

    private async onTransaction(data: { from: string, to: string, value: number }) {
        let fromListeners = await this.isSubscribed(data.from);
        let toListeners = await this.isSubscribed(data.to);

        fromListeners.forEach(x => {
            this.discord.sendMessageToChannel(x.channelId, `${ x.label || data.from } has sent ${ data.value } ETH to ${ data.to }`);
        });

        toListeners.forEach(x => {
            this.discord.sendMessageToChannel(x.channelId, `${ x.label || data.to } has received ${ data.value } ETH from ${ data.from }`);
        });
    }

    private async isSubscribed(address: string): Promise<{ channelId: string, label?: string }[]> {
        // This if prevent the app to fetch mongodb every time a new transaction arrives. Since there is a huge amount of transactions every second, it's a good idea to have a kind of
        // cache that only fetch the mongodb when the address is stored. It's a simple one, but we could make it even better.
        if(this._walletCache[address])
            return (await Wallet.findChannelAndLabelByAddress(address)).map(x => ({ channelId: x.channelId, label: x.label }));

        return [];
    }

    private async loadCache() {
        this._walletCache = {};
        const result = (await Wallet.findAllAddresses()).map(x => x.address);

        result.forEach(x => {
            this.followWallet(x);
        });
    }

    private followWallet(address: string) {
        this._walletCache[address] = true;
    }
}