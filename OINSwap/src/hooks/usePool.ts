/**
 * Created by buddy on 2020-07-24.
 */
import { useCallback, useEffect, useRef } from 'react';

export const usePolling = (action, time = 800) => {
	const timer = useRef(null);
	const actionPro = useCallback(
		flag => {
			if (!action) {
				return;
			}
			// const start = Date.now();
			action().then(() => {
				// console.log(action, Date.now() - start);

				if (flag.current) {
					return;
				}
				timer.current = setTimeout(() => actionPro(flag), time);
				return;
			});
		},
		[action, time]
	);

	useEffect(() => {
		const flag = { current: false };
		actionPro(flag);

		return () => {
			flag.current = true;
			clearInterval(timer.current);
		};
	}, [action, actionPro, time]);
};
