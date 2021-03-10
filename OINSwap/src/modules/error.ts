/**
 * Created by buddy on 2020-07-24.
 */
import { observable } from 'mobx';

class Error {
	@observable message = '';

	setMessage(msg) {
		if (JSON.stringify({}) === JSON.stringify(msg)) {
			return;
		}
		if (msg === 'CANCELED') {
			return;
		}
		if (msg === 'TIMEOUT') {
			return;
		}
		this.message = msg;
	}
}

export default new Error();
