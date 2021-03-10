/**
 * Created by buddy on 2020-08-07.
 */
import { getStorage } from '@/wallet';
import { byteArrayReverse, storage2Value } from '@/utils';
import Exchange from '@/sdk/Exchange';

interface TokenProps {
	name: string;
	symbol?: string;
	logo?: string;
	decimal?: number;
	address: string;
}

class Token {
	name: string;
	symbol: string;
	logo: string;
	decimal: number;
	address: string;
	exchange: Exchange;
	reverseAddr: string;
	factor: number;

	constructor(config = {}) {
		const { name, logo, decimal = 8, symbol, address } = config as TokenProps;
		this.name = name;
		this.logo = logo || name;
		this.symbol = symbol || name;
		this.decimal = decimal;
		this.address = address;
		this.reverseAddr = byteArrayReverse(address);
		this.exchange = new Exchange(address);
		this.factor = 10 ** this.decimal;
	}

	async balanceOf(address: string) {
		let balance: any = await getStorage(this.address, `01${address}`);
		balance = storage2Value(balance);
		return this.toWebValue(balance);
	}

	getExchangeHash() {
		return this.exchange;
	}

	toWebValue(amount) {
		return +(amount / this.factor).toFixed(this.decimal);
	}

	toOntValue(amount) {
		return Math.floor(amount * this.factor);
	}
}

export default Token;
