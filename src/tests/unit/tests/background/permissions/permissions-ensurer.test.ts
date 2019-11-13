// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PermissionsEnsurer } from 'background/permissions/permissions-ensurer';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { isFunction } from 'lodash';
import { IMock, It, Mock } from 'typemoq';

describe('PermissionsEnsurer', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;

    const testTabId = 1010101;

    let testSubject: PermissionsEnsurer;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();

        testSubject = new PermissionsEnsurer(browserAdapterMock.object);
    });

    it('does not ask for permissions if already granted', async () => {
        browserAdapterMock
            .setup(adapter => adapter.executeScriptInTab(testTabId, It.isObjectWith({ code: '"injected' })))
            .returns(() => Promise.resolve([]));

        const result = await testSubject.ensureInjectPermissions(testTabId);

        expect(result).toBe(true);
    });

    describe('request permissions', () => {
        const testOrigin = 'http://test.url';

        beforeEach(() => {
            browserAdapterMock
                .setup(adapter => adapter.executeScriptInTab(testTabId, It.isObjectWith({ code: '"injected"' })))
                .returns(() => Promise.reject({ message: PermissionsEnsurer.noPermissionsMessageEnding }));

            browserAdapterMock
                .setup(adapter => adapter.getTab(testTabId, It.is(isFunction)))
                .callback((tabId, handler) => {
                    handler({ url: `${testOrigin}/test-path?id=1` } as chrome.tabs.Tab);
                });
        });

        it('allowed', async () => {
            browserAdapterMock
                .setup(adapter => adapter.requestPermissions(It.isValue({ origins: [testOrigin + '/'] })))
                .returns(() => Promise.resolve(true));

            const result = await testSubject.ensureInjectPermissions(testTabId);

            expect(result).toBe(true);
        });

        it('denied', async () => {
            browserAdapterMock
                .setup(adapter => adapter.requestPermissions(It.isValue({ origins: [testOrigin + '/'] })))
                .returns(() => Promise.resolve(false));

            const result = await testSubject.ensureInjectPermissions(testTabId);

            expect(result).toBe(false);
        });

        it('error with no user gesture message', async () => {
            browserAdapterMock
                .setup(adapter => adapter.requestPermissions(It.isValue({ origins: [testOrigin + '/'] })))
                .returns(() => Promise.reject({ message: PermissionsEnsurer.noUserGestureMessage }));

            const result = await testSubject.ensureInjectPermissions(testTabId);

            expect(result).toBe(false);
        });

        it('generic error', async () => {
            const errorMessage = 'dummy error';

            browserAdapterMock
                .setup(adapter => adapter.requestPermissions(It.isValue({ origins: [testOrigin + '/'] })))
                .returns(() => Promise.reject({ message: errorMessage }));

            await expect(testSubject.ensureInjectPermissions(testTabId)).rejects.toEqual(errorMessage);
        });
    });
});
