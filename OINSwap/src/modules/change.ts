/**
 * Created by buddy on 2020-08-11.
 */
import { computed, observable } from 'mobx';
import { OntToken } from '@/constants';
import { getBackMode, toDownFixed } from '@/utils';
import * as iWallet from '@/wallet';
import user from '@/modules/user';
import Big from 'big.js';
import { toast } from 'react-toastify';
import wallet from '@/modules/wallet';

class ToOntd {
	@observable input = { ...OntToken, value: '' };
	@observable output = { ...wallet.nativeToken, value: '' };

	@observable loading = 0;
	async onSubmit() {
		const amount = Math.floor(+this.output.value);
		try {
			this.loading++;

			const method = `${this.input.name.toLowerCase()}2${this.output.name.toLowerCase()}`;

			const contract = this.input.name.length > this.output.name.length ? this.input.hash : this.output.hash;

			console.log(this.input.name, this.output.name);

			const x = await iWallet.nativeChange(contract, method, user.address, amount * this.input.factor);
			x && toast.success('Change Success');
		} catch (e) {
			/* error */
		} finally {
			this.loading--;
			this.input.value = '';
			this.output.value = '';
		}
	}

	onInput(value, mode) {
		this[mode].value = value;
		this[getBackMode(mode)].value = value;
	}

	inverted() {
		const x: any = this.input;
		this.input = this.output;
		this.output = x;
	}

	@observable focusType = 'input';

	onTokenSelected = (token, mode) => {
		if (this[mode]?.name === token.name) {
			return;
		}
		const t = { ...token, value: '' };

		if (t.name === this[getBackMode(mode)].name) {
			this.inverted();
			return;
		}

		const x = this.input.value;
		if (['ONG', 'ONGD'].includes(t.name)) {
			this[mode] = t;
			this[getBackMode(mode)] = {
				...wallet.changeTokens.find(
					x => (t.name === 'ONGD' && x.name === 'ONG') || (t.name === 'ONG' && x.name === 'ONGD')
				),
				value: '',
			};
		}

		if (['ONT', 'ONTD'].includes(t.name)) {
			this[mode] = t;
			this[getBackMode(mode)] = {
				...wallet.changeTokens.find(
					x => (t.name === 'ONTD' && x.name === 'ONT') || (t.name === 'ONT' && x.name === 'ONTD')
				),
				value: '',
			};
		}
		this.onInput(x, 'input');
	};

	@computed get isEnoughBalance() {
		return this.inputValue.lte(user.balance[this.input.name] || 0);
	}

	@computed get inputValue() {
		return Big(this.output.value || 0);
	}

	@computed get receivedText() {
		const value = !this.output.value ? '-' : toDownFixed(this.output.value);
		return `${value} ${this.output.name}`;
	}
}

export default ToOntd;
