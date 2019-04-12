// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnvironmentInfoProvider } from './../../../common/environment-info-provider';
describe('EnvironmentInfoProvider', () => {
    test('constructor', () => {
        expect(new EnvironmentInfoProvider('extensionVersion', 'spec', 'axeVersion')).not.toBeNull();
    });

    test('get', () => {
        const extensionVersion = '1.1.1';
        const browserSpec = 'chrome';
        const axeCoreVersion = '2.2.2';
        const expected = {
            extensionVersion,
            browserSpec,
            axeCoreVersion,
        };
        expect(new EnvironmentInfoProvider(extensionVersion, browserSpec, axeCoreVersion).getEnvironmentInfo()).toEqual(expected);
    });
});
