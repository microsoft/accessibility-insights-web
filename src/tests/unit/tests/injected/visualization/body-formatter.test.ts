// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BodyFormatter } from '../../../../../injected/visualization/body-formatter';
import { IColorDrawerConfiguration, IBodyDrawerConfiguration } from '../../../../../injected/visualization/iformatter';

describe('BodyFormatterTests', () => {
    let testSubject: BodyFormatter;
    const defaultConfig: IBodyDrawerConfiguration = {
        injectedClassName: 'insights-grey-scale-container',
    };

    beforeEach(() => {
        testSubject = new BodyFormatter('insights-grey-scale-container');
    });

    test('Verify the configuration is correct', () => {
        const config = testSubject.getDrawerConfiguration();
        expect(config).toEqual(defaultConfig);
    });
});
