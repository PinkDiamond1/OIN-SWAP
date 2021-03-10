/**
 * Created by buddy on 2020-08-05.
 */
import { computed, observable } from 'mobx';
import * as iWallet from '@/wallet';
import { NATIVE_TOKEN, OngToken, OntToken } from '@/constants';

class User {
	@observable.struct balance = {};
	@observable transaction = [];
	@observable address;

	async askNativeBalance() {
		if (!this.address) {
			return;
		}
		try {
			const { ONT, ONG, ONTD } = await iWallet.getNativeBalance(this.address);
			this.balance = { ...this.balance, ONT, ONG, ONTD };
		} catch (e) {
			// console.log(e);
			/* error */
		}
	}

	async askTokenBalance(token) {
		if (!this.address) {
			return;
		}
		if (!token) {
			return;
		}
		if ([NATIVE_TOKEN, OntToken.name, OngToken.name].includes(token.name)) {
			return;
		}

		try {
			const res = await iWallet.balanceOfAddress(token, this.address);
			this.balance = { ...this.balance, [token.name]: res };
		} catch (e) {
			/* error */
		}
	}

	login(address) {
		this.address = address;
	}

	reset() {
		this.transaction = [];
		this.balance = {};
	}

	@computed get isNullTransaction() {
		return JSON.stringify(this.transaction) === '[]';
	}

	@computed get isNullBalance() {
		return JSON.stringify(this.balance) === '{}';
	}

	@computed get ellipsisAddress() {
		if (!this.address) {
			return '';
		}
		const address = this.address;
		return `${address.substr(0, 6)}...${this.address.substr(address.length - 6, address.length)}`;
	}
}

export default new User();
