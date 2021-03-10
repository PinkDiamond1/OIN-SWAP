/**
 * Created by buddy on 2020-07-21.
 */

import { createAction } from '@reduxjs/toolkit';

export const updateWalletStatus = createAction<number>('updateWalletStatus');
