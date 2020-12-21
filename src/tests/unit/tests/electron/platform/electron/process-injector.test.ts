// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ProcessInjector } from 'electron/platform/electron/process-injector';

describe('ProcessInjector', () => {
    it.skip('launches and connects to an electron process', async () => {
        const injector = new ProcessInjector();
        const output = await injector.launchUnderDebugger();
        expect(output).toEqual([]);
    });

    it('connects to an electron process', async () => {
        const injector = new ProcessInjector();
        const windows = await injector.listWindows();
        expect(windows.length).toBe(1);
        const result = await windows[0].evaluate({
            expression: 'document.title',
            returnByValue: true,
        });
        const title = result.value;
        expect(title).toBe('Accessibility Insights for Android - Connect to your Android device');
    });
});
