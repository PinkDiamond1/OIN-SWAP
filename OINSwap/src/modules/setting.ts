/**
 * Created by buddy on 2020-07-24.
 */
import { computed, observable } from 'mobx';

class Setting {
	@observable deadline = 20;
	@observable slippage = 0.005;

	setDeadline(time: number) {
		// @ts-ignore
		this.deadline = time;
	}

	setSlippage(slippage: number) {
		this.slippage = slippage;
	}

	@computed get upSlippageRate() {
		return this.slippage + 1;
	}

	@computed get downSlippageRate() {
		return 1 - this.slippage;
	}

	@computed get deadlineValue() {
		return this.deadline * 60;
	}
}

export default new Setting();
