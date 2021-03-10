/**
 * Created by buddy on 2020-07-24.
 */

import { computed, observable } from 'mobx';
import CountUtil from '@/modules/CountUtil';
import { NATIVE_TOKEN, NULL_TEXT, Tips } from '@/constants';
import {
	getExchange,
	getExchangeBalance,
	getExchangeBalanceByExhash,
	getLiquidity,
	getLiquidityByExhash,
} from '@/wallet';
import { PoolToken } from '@/types';
import { toDownFixed } from '@/utils';
import Big from 'big.js';
import wallet from '@/modules/wallet';

export default class BasePool extends CountUtil {
	token?: PoolToken = null;

	@observable rateMode = true;
	@observable nativeValue: any = '';
	@observable tokenValue: any = '';
	@observable input: any = '';

	changeMode() {
		// this.rateMode = !this.rateMode;
	}

	@computed get tokenRate() {
		if (!this.token) {
			return NULL_TEXT;
		}
		const { name, balance, nativeBalance } = this.token;
		const { nativeValue, tokenValue } = this;

		if (+nativeBalance) {
			return `1 ${NATIVE_TOKEN} = ${toDownFixed(Big(balance).div(nativeBalance).toString(), 4)} ${name}`;
		}

		if (!+nativeValue || !+tokenValue) {
			return NULL_TEXT;
		}
		return `1 ${NATIVE_TOKEN} =  ${toDownFixed(Big(tokenValue).div(nativeValue), 4)} ${name}`;
	}

	@computed get poolText() {
		if (!this.token) {
			return NULL_TEXT;
		}
		const { nativeBalance, balance, name } = this.token;
		if (!nativeBalance) {
			return NULL_TEXT;
		}
		return `${+nativeBalance} ${NATIVE_TOKEN} + ${+balance} ${name}`;
	}

	// TODO 待调整
	@computed get poolRate() {
		if (!this.token) {
			return NULL_TEXT;
		}
		const { liquidity, myLiquidity } = this.token;
		if (!this.token.nativeBalance) {
			if (this.token.nativeBalance == 0 && this.tokenValue && this.nativeValue) {
				return '100%';
			}
			return NULL_TEXT;
		}

		const liquidityMint = new Big(this.nativeValue || 0).div(this.token.nativeBalance).mul(liquidity);
		const nMyLiquidity = new Big(myLiquidity || 0).add(liquidityMint);
		const nLiquidity = new Big(liquidity || 0).add(liquidityMint);
		if (!nLiquidity) {
			return NULL_TEXT;
		}

		return nMyLiquidity.div(nLiquidity).mul(100).toFixed(2) + '%';
	}

	onInput(a, b) {}

	/* TODO 除了网络请求之外都需要处理 */
	@observable isFirstLoaded = false;
	@observable isPoolExisted;
	exchangeMap = {};
	async fetchLiquidityInfo() {
		if (!this.token) {
			return;
		}
		const tokeName = this.token.name;
		try {
			const hash = this.token.hash;

			const prev = [this.token.liquidity, this.token.myLiquidity, this.token.balance, this.token.nativeValue];

			let exchangeHash = this.exchangeMap[hash];
			if (!exchangeHash) {
				exchangeHash = await getExchange(hash);
			}

			const res = await Promise.all([
				getLiquidityByExhash(exchangeHash),
				getExchangeBalanceByExhash(this.token, exchangeHash),
			]);

			if (res && tokeName === this.token.name) {
				const [[liquidity, myLiquidity], [balance, nativeBalance]] = res;
				this.token.liquidity = +liquidity;
				this.token.myLiquidity = +myLiquidity;
				this.token.balance = +balance;
				this.token.nativeBalance = +nativeBalance;

				console.log({
					liquidity,
					myLiquidity,
					balance: this.token.balance,
					nativeBalance: this.token.nativeBalance,
				});

				this.token.position = {
					native: liquidity
						? toDownFixed(new Big(myLiquidity).div(liquidity).mul(this.token.nativeBalance), wallet.nativeToken.decimal)
						: 0,
					token: liquidity
						? toDownFixed(new Big(myLiquidity).div(liquidity).mul(this.token.balance), this.token.decimal)
						: 0,
				};

				if (
					JSON.stringify(prev) !==
					JSON.stringify([this.token.liquidity, this.token.myLiquidity, this.token.balance, this.token.nativeValue])
				)
					this.onInput(this.nativeValue || this.input, 'input');

				if (!this.isFirstLoaded) {
					this.isFirstLoaded = true;
					this.isPoolExisted = true;
				}
			}
		} catch (e) {
			if (e.message === Tips.NoExchange && tokeName === this.token.name && !this.isFirstLoaded) {
				this.isFirstLoaded = true;
				this.isPoolExisted = false;
			}

			console.log(e);
			/* error */
		}
	}
}
