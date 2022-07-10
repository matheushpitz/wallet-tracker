import { AlchemyWeb3, createAlchemyWeb3 } from "@alch/alchemy-web3";

export function createAlchemy(conn: string): AlchemyWeb3 {
    return createAlchemyWeb3(conn);
}