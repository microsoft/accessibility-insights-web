// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { OSType, PlatformInfo } from 'electron/platform-info';
import { IMock, Mock } from 'typemoq';

describe(PlatformInfo, () => {
    let testSubject: PlatformInfo;
    let processMock: IMock<NodeJS.Process>;

    beforeEach(() => {
        processMock = Mock.ofType<NodeJS.Process>();

        testSubject = new PlatformInfo(processMock.object);
    });

    describe('getOS', () => {
        type GetOsTestCase = { platformName: typeof process.platform; osType: OSType };

        test.each([
            { platformName: 'linux', osType: OSType.Linux },
            { platformName: 'darwin', osType: OSType.Mac },
            { platformName: 'win32', osType: OSType.Windows },
        ] as GetOsTestCase[])('validate getOs %o', (testCase: GetOsTestCase) => {
            processMock.setup(p => p.platform).returns(() => testCase.platformName);

            expect(testSubject.getOs()).toBe(testCase.osType);
        });
    });

    it('isMac', () => {
        processMock.setup(p => p.platform).returns(() => 'darwin');

        expect(testSubject.isMac()).toBe(true);
    });
});
