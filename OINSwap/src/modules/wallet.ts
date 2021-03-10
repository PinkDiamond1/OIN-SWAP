/**
 * Created by buddy on 2020-07-25.
 */

import { computed, observable } from 'mobx';
import { EnvConfig, NATIVE_TOKEN, WALLET_STATUS } from '@/constants';
import * as iWallet from '@/wallet';
import user from '@/modules/user';

const LOCK_FLAG = 'locked';

class Wallet {
	@observable status = WALLET_STATUS.NOT_INSTALLED;
	@observable account = null;
	@observable.struct network = { address: 'dappnode3.ont.io', type: 'MAIN' };

	async askWalletStatus() {
		if (this.status !== WALLET_STATUS.NOT_INSTALLED) {
			const isInstalled = await iWallet.isInstalled();
			if (!isInstalled) {
				this.status = WALLET_STATUS.NOT_INSTALLED;
				return;
			}
		}

		try {
			const address = await iWallet.getAccount();
			if (address !== user.address) {
				user.login(address);
			}
			this.status = WALLET_STATUS.SINGED;
		} catch (e) {
			/* ont */
			if (e === 'NO_ACCOUNT') {
				this.status = WALLET_STATUS.NOT_CONNECTED;
			}

			/* iost */
			if (new RegExp(LOCK_FLAG, 'ig').test(e.type)) {
				this.status = WALLET_STATUS.LOCKED;
			}
		}
	}

	async askNetwork() {
		const x = await iWallet.getNetWork();
		if (x.type !== this.network.type) {
			user.reset();
		}
		this.network = x;
	}

	getCoinAddress(coin) {
		return `https://explorer.ont.io/token/detail/oep4/${coin.hash}/${coin.symbol}/10/1/${this.isTest ? 'testnet' : ''}`;
	}

	@computed get isTest() {
		return this.network.type !== 'MAIN';
	}

	@computed get rpcDomain() {
		return this.network.type === 'MAIN' ? 'https://explorer.ont.io' : 'https://polarisexplorer.ont.io';
	}

	@computed get isInstalled() {
		return this.status !== WALLET_STATUS.NOT_INSTALLED;
	}

	@computed get isLocked() {
		return this.status === WALLET_STATUS.LOCKED;
	}

	@computed get isLogin() {
		return this.status === WALLET_STATUS.SINGED;
	}

	@computed get tokens() {
		return EnvConfig[this.network.type].tokens;
	}

	@computed get noNativeTokens() {
		const native = this.tokens.findIndex(x => x.name === NATIVE_TOKEN);
		const x = this.tokens.slice();
		x.splice(native, 1);
		return x;
	}

	@computed get factory() {
		return EnvConfig[this.network.type].factory;
	}

	@computed get nativeToken() {
		return EnvConfig[this.network.type].nativeToken;
	}

	@computed get changeTokens() {
		return EnvConfig[this.network.type].changeTokens;
	}
}

export default new Wallet();
