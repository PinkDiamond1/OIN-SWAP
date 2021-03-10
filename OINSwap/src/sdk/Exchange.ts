/**
 * Created by buddy on 2020-08-07.
 */
import { getExchange } from '@/wallet';
import { byteArrayReverse } from '@/utils';

class Exchange {
	exchangeHash: string;
	exchangeAddr: string;

	constructor(address: string) {
		getExchange(address).then(x => {
			this.exchangeHash = x;
			this.exchangeAddr = byteArrayReverse(x);
		});
	}

	addLiquidity() {
		/**/
	}

	removeLiquidity() {
		/**/
	}
}

export default Exchange;
