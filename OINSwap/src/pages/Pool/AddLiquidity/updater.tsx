/**
 * Created by buddy on 2020-07-23.
 */
import { observer } from 'mobx-react';
import { useCallback, useContext } from 'react';
import { AddLiquidityContext } from '@/pages/Pool/AddLiquidity/context';
import { usePolling } from '@/hooks/usePool';

export default observer(() => {
	const { state } = useContext(AddLiquidityContext);

	usePolling(useCallback(() => state.fetchLiquidityInfo(), [state]));

	return null;
});
