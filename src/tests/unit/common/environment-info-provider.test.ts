// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from '../../../common/types/store-data/unified-data-interface';
import { toolName } from '../../../content/strings/application';
import { EnvironmentInfoProvider } from './../../../common/environment-info-provider';

describe('EnvironmentInfoProvider', () => {
    const extensionVersion = '1.1.1';
    const axeCoreVersion = '2.2.2';
    const browserSpec = 'test-browser-spec';

    let environmentInfoProvider: EnvironmentInfoProvider;

    beforeEach(() => {
        environmentInfoProvider = new EnvironmentInfoProvider(
            extensionVersion,
            browserSpec,
            axeCoreVersion,
        );
    });

    test('constructor', () => {
        expect(environmentInfoProvider).not.toBeNull();
    });

    test('getEnvironmentInfo', () => {
        const expected = {
            extensionVersion,
            browserSpec,
            axeCoreVersion,
        };

        expect(environmentInfoProvider.getEnvironmentInfo()).toEqual(expected);
    });

    test('getToolData', () => {
        const expected: ToolData = {
            scanEngineProperties: {
                name: 'axe-core',
                version: axeCoreVersion,
            },
            applicationProperties: {
                name: toolName,
                version: extensionVersion,
                environmentName: browserSpec,
            },
        };

        expect(environmentInfoProvider.getToolData()).toEqual(expected);
    });
});
