/**
 * Created by buddy on 2020-04-06.
 */

import * as React from 'react';
import { isIos } from '@/utils';

/*
	TODO iOS 10+ viewport无法禁止双指缩放的解决方案
* * */
export const useNotZoomEffect = () => {
	React.useEffect(() => {
		if (!isIos()) {
			return;
		}

		// 阻止双指放大
		document.addEventListener('gesturestart', function (event) {
			event.preventDefault();
		});
	}, []);
};

export const useActiveWeb3React = () => {};
