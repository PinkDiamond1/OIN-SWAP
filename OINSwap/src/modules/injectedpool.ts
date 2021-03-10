/**
 * Created by buddy on 2020-07-23.
 */
import { computed, observable } from 'mobx';
import BasePool from '@/modules/BasePool';
import { PoolToken } from '@/types';
import { NATIVE_TOKEN, TOKEN_MODE } from '@/constants';
import * as iWallet from '@/wallet';
import setting from '@/modules/setting';
import user from '@/modules/user';
import { toDownFixed, withBalance, withFactor } from '@/utils';
import Big from 'big.js';
import { toast } from 'react-toastify';
import wallet from '@/modules/wallet';

const initialToken = {
	nativeBalance: 0,
	balance: 0,
	liquidity: 0,
	myLiquidity: 0,
};

export default class InjectedPool extends BasePool {
	@observable token = null;

	setupToken = (token: PoolToken) => {
		this.token = { ...initialToken, ...token };
		this.tokenValue = '';
		this.isFirstLoaded = false;
		this.isPoolExisted = false;
	};

	@observable loading = 0;
	onSubmit = async () => {
		const { nativeValue, tokenValue } = this;

		try {
			this.loading++;
			const { decimal, factor } = wallet.nativeToken;
			const res = await iWallet.addLiquidity(this.token.hash, [
				withFactor(10 ** -decimal, factor),
				toDownFixed(Big(setting.upSlippageRate).mul(withFactor(tokenValue, this.token.factor))),
				setting.deadlineValue,
				user.address,
				withFactor(nativeValue, factor),
			]);
			res && toast.success('Add Liquidity Success');
			return res;
		} finally {
			this.loading--;
			this.tokenValue = '';
			this.nativeValue = '';
			this.input = '';
		}
	};

	onInput = (value, mode) => {
		const isInput = mode === TOKEN_MODE.INPUT;
		const input = isInput ? 'nativeValue' : 'tokenValue';
		const output = isInput ? 'tokenValue' : 'nativeValue';
		this[input] = value;

		if (!this.token) {
			return;
		}

		const { nativeBalance, balance } = this.token;

		if (!nativeBalance || !balance) {
			return;
		}

		const value2 = Big(value || 0);

		if (value2.eq(0)) {
			this[output] = '';
			return;
		}

		const t = toDownFixed(
			value2.mul(isInput ? Big(balance).div(nativeBalance) : Big(nativeBalance).div(balance)),
			isInput ? this.token.decimal : wallet.nativeToken.decimal
		);

		this[output] = t;
	};

	@computed get isEnough() {
		return (
			Big(this.tokenValue || 0).lte(withBalance(user.balance[this.token.name])) &&
			Big(this.nativeValue || 0).lte(withBalance(user.balance[NATIVE_TOKEN]))
		);
	}

	@computed get overLiquidity() {
		return Big(this.nativeValue || 0).gte(1);
	}

	@computed get isEmpty() {
		return !this.token || this.token.liquidity === 0;
	}

	async createExchange() {
		try {
			const res = await iWallet.createExchange(this.token);
			res && (this.isFirstLoaded = false);
		} catch (e) {
			/* error */
		}
	}
}
