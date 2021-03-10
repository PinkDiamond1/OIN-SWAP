/**
 * Created by buddy on 2020-08-05.
 */
import { usePolling } from '@/hooks/usePool';
import { useCallback } from 'react';
import user from '@/modules/user';

export default () => {
	usePolling(
		useCallback(() => user.askNativeBalance(), []),
		1200
	);

	return null;
};
