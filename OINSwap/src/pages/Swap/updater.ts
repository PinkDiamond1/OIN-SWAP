/**
 * Created by buddy on 2020-07-23.
 */
import { observer } from 'mobx-react';
import { useCallback, useContext } from 'react';
import { SwapContext } from '@/pages/Swap/context';
import { usePolling } from '@/hooks/usePool';
import { TOKEN_MODE } from '@/constants';
import user from '@/modules/user';

export default observer(() => {
	const { state } = useContext(SwapContext);

	usePolling(
		useCallback(
			() => Promise.all([state.fetchTokenBalance(TOKEN_MODE.INPUT), state.fetchTokenBalance(TOKEN_MODE.OUTPUT)]),
			[state]
		)
	);

	usePolling(
		useCallback(
			() =>
				Promise.all([user.askTokenBalance(state[TOKEN_MODE.INPUT]), user.askTokenBalance(state[TOKEN_MODE.OUTPUT])]),
			[state]
		)
	);

	return null;
});
