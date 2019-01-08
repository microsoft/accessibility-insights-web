// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ColorFormatter } from '../../../../../injected/visualization/color-formatter';
import { IColorDrawerConfiguration } from '../../../../../injected/visualization/iformatter';

describe('ColorFormatterTests', () => {
    let testSubject: ColorFormatter;
    const defaultConfig: IColorDrawerConfiguration = {
        grayScaleClassName: 'insights-grey-scale-container',
    };

    beforeEach(() => {
        testSubject = new ColorFormatter();
    });

    test('Verify the configuration is correct', () => {
        const config = testSubject.getDrawerConfiguration();
        expect(config).toEqual(defaultConfig);
    });
});
