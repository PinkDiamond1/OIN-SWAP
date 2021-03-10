/**
 * Created by buddy on 2020-08-18.
 */
import { action, computed, observable } from 'mobx';
import wallet from '@/modules/wallet';
import { EnvConfig } from '@/constants';
import { sortToken } from '@/utils';
import { create, persist } from 'mobx-persist';

class TokensModule {
	@persist('list') @observable outMAINCoins = [];
	@persist('list') @observable outTESTCoins = [];

	@persist('list') @observable warnedCoins = [];

	@action('AddWarned')
	addWarned(coin) {
		this.warnedCoins.push(coin);
	}

	@action('ADD')
	addCoin(coin) {
		this[this.outCoins].push(coin);
	}

	@action('DEL')
	delCoin(coin) {
		const coins = this[this.outCoins];
		const i = coins.findIndex(c => c.hash === coin.hash);
		this[this.outCoins].splice(i, 1);
	}

	isInAdds(coin) {
		return this.addCoins.findIndex(c => c.hash === coin.hash) !== -1;
	}

	isAlertCoin(coin) {
		return (
			this.baseCoins.findIndex(c => c.hash === coin.hash) === -1 &&
			this.warnedCoins.findIndex(c => c.hash === coin.hash) === -1
		);
	}

	@computed get outCoins() {
		return `out${wallet.network.type}Coins`;
	}

	@computed get addCoins() {
		return this[this.outCoins] || [];
	}

	@computed get baseCoins() {
		return EnvConfig[wallet.network.type].tokens;
	}

	@computed get allCoins() {
		return this.baseCoins.concat(this.addCoins).sort(sortToken);
	}
}

const hydrate = create();

const tokensModule = new TokensModule();
export default tokensModule;
hydrate('module-token', tokensModule);
