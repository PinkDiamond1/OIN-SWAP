/**
 * Created by buddy on 2020-07-23.
 */
import { computed, observable } from 'mobx';
import BasePool from '@/modules/BasePool';
import { NATIVE_TOKEN, NULL_TEXT } from '@/constants';
import setting from '@/modules/setting';
import { toDownFixed, withFactor } from '@/utils';
import { removeLiquidity } from '@/wallet';
import user from '@/modules/user';
import Big from 'big.js';
import { toast } from 'react-toastify';
import wallet from '@/modules/wallet';

const initialToken = {
	name: '',
	logo: '',
	address: '',
	nativeBalance: 0,
	balance: 0,
	liquidity: 0,
	myLiquidity: 0,
};

/* TODO 提取资金的时候其实是要显示 position的 */

export default class RelevantPool extends BasePool {
	@observable token = null;

	@observable input: any = '';

	setupToken = token => {
		this.token = { ...initialToken, ...token };
	};

	onMax = value => {
		this.onInput(value);
	};

	onInput = value => {
		if (!this.token) {
			this.input = value;
			return;
		}
		const { myLiquidity } = this.token;
		if (!myLiquidity) {
			this.input = value;
		} else {
			this.input = +value > +myLiquidity ? myLiquidity : value;
		}
	};

	@observable loading = 0;
	onSubmit = async () => {
		try {
			this.loading++;
			const x = await removeLiquidity(this.token.hash, [
				withFactor(this.input, wallet.nativeToken.factor),
				withFactor(this.minNativeValue, wallet.nativeToken.factor),
				withFactor(this.minTokenValue, this.token.factor),
				setting.deadlineValue,
				user.address,
			]);
			x && toast.success('Remove Liquidity Success');
			return x;
		} catch (e) {
			/* error */
		} finally {
			this.loading--;
			this.input = '';
		}
	};

	@computed get minTokenValue() {
		const { balance, liquidity } = this.token;
		const { input } = this;
		// @ts-ignore
		if (!liquidity) {
			return 0;
		}
		return toDownFixed(Big(input).mul(balance).div(liquidity), this.token.decimal);
	}

	@computed get minNativeValue() {
		const { nativeBalance, liquidity } = this.token;
		const { input } = this;
		// @ts-ignore
		return toDownFixed(Big(input).mul(nativeBalance).div(liquidity), wallet.nativeToken.decimal);
	}

	@computed get outputText() {
		if (!this.token) {
			return '';
		}

		const num = +this.input;
		const { nativeBalance, balance, liquidity } = this.token;

		if (!nativeBalance || !balance || !liquidity || !num) {
			return '';
		}

		return `${this.minNativeValue} ${NATIVE_TOKEN} + ${this.minTokenValue} ${this.token.name}`;
	}

	@computed get positionText() {
		if (!this.token || !this.token.position) {
			return NULL_TEXT;
		}
		const { native, token } = this.token.position;
		if (!+native || !+token) {
			return NULL_TEXT;
		}
		return `${native} ${NATIVE_TOKEN} + ${token} ${this.token.name}`;
	}

	@computed get poolRate() {
		if (!this.token) {
			return NULL_TEXT;
		}
		const { liquidity, myLiquidity } = this.token;
		if (!myLiquidity || !this.token.nativeBalance) {
			return NULL_TEXT;
		}
		const liquidityMint = new Big(this.input || 0);
		const nMyLiquidity = new Big(myLiquidity).sub(liquidityMint);
		const nLiquidity = new Big(liquidity).sub(liquidityMint);
		if (nLiquidity.lte(0)) {
			return '0.00%';
		}
		return nMyLiquidity.div(nLiquidity).mul(100).toFixed(2) + '%';
	}

	@computed get isInvalidValue() {
		return +this.minTokenValue <= 0 || +this.minNativeValue <= 0;
	}

	@computed get overMyLiquidity() {
		if (!this.token.myLiquidity) {
			return false;
		}
		return Big(this.input).lte(this.token.myLiquidity);
	}
}
