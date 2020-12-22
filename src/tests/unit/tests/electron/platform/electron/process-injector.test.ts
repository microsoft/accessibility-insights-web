// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ProcessInjector } from 'electron/platform/electron/process-injector';

describe('ProcessInjector', () => {
    const targetBinary =
        'C:\\Users\\karansin\\AppData\\Local\\Programs\\Accessibility Insights for Android\\Accessibility Insights for Android.exe';
    it.skip('launches and connects to an electron process', async () => {
        const injector = new ProcessInjector(targetBinary);
        const output = await injector.launchUnderDebugger();
        expect(output).toEqual([]);
    });

    it('connects to an electron process', async () => {
        const injector = new ProcessInjector(targetBinary);
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
