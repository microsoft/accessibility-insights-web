// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NullDrawer } from '../../../../../injected/visualization/null-drawer';

describe('NullDrawer', () => {
    test('null drawer does nothing', async () => {
        const testObject = new NullDrawer();
        testObject.initialize(null);
        await testObject.drawLayout();
        testObject.eraseLayout();
    });
});
