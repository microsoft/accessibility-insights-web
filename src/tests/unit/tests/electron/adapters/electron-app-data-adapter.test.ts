// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ConfigAccessor } from 'common/configuration/configuration-types';
import { ElectronAppDataAdapter } from 'electron/adapters/electron-app-data-adapter';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe(ElectronAppDataAdapter, () => {
    let configAccessorMock: IMock<ConfigAccessor>;
    let testSubject: ElectronAppDataAdapter;

    beforeEach(() => {
        configAccessorMock = Mock.ofType<ConfigAccessor>(undefined, MockBehavior.Strict);
        testSubject = new ElectronAppDataAdapter(configAccessorMock.object);
    });

    afterEach(() => {
        configAccessorMock.verifyAll();
    });

    it('do nothing at construction', () => {});

    it('chain to shim on getVersion', () => {
        const expectedVersion = 'New super duper version';

        configAccessorMock
            .setup(b => b.getOption('unifiedAppVersion'))
            .returns(() => expectedVersion)
            .verifiable(Times.once());
        expect(testSubject.getVersion()).toBe(expectedVersion);
    });
});
