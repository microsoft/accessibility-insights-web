// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PermissionsEnsurer } from 'background/permissions/permissions-ensurer';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
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
        it('allowed', () => {});
        it('denied', () => {});
    });
});
