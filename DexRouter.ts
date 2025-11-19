import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { swap as raydiumSwap, getRaydiumPrice } from './raydium';
import { swap as meteoraSwap, getMeteoraPrice } from './meteora';

export class DexRouter {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    public async comparePrices(tokenA: string, tokenB: string): Promise<{ raydiumPrice: number; meteoraPrice: number }> {
        const raydiumPrice = await getRaydiumPrice(tokenA, tokenB);
        const meteoraPrice = await getMeteoraPrice(tokenA, tokenB);
        return { raydiumPrice, meteoraPrice };
    }

    public async executeSwap(tokenA: string, tokenB: string, amount: number): Promise<Transaction> {
        const { raydiumPrice, meteoraPrice } = await this.comparePrices(tokenA, tokenB);
        if (raydiumPrice > meteoraPrice) {
            return await raydiumSwap(tokenA, tokenB, amount);
        } else {
            return await meteoraSwap(tokenA, tokenB, amount);
        }
    }
}