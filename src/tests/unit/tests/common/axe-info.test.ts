// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AxeInfo } from '../../../../common/axe-info';

const VERSION = 'axe.core.version';

describe('axeInfo', () => {
    const axe = { version: 'axe.core.version' };
    const axeInfo = new AxeInfo(axe as any);

    it('returns correct version', () => {
        expect(axeInfo.version).toBe(VERSION);
    });
});
