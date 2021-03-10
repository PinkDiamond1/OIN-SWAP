/**
 * Created by buddy on 2020-07-23.
 */

import { observer } from 'mobx-react';
import { useCallback, useContext } from 'react';
import { RemoveLiquidity } from '@/pages/Pool/RemoveLiquidity/context';
import { usePolling } from '@/hooks/usePool';

export default observer(() => {
	const { state } = useContext(RemoveLiquidity);

	usePolling(useCallback(() => state.fetchLiquidityInfo(), [state]));

	return null;
});
