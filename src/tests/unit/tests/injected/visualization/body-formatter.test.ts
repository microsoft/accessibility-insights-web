// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BodyFormatter } from '../../../../../injected/visualization/body-formatter';
import { IBodyDrawerConfiguration } from '../../../../../injected/visualization/iformatter';

describe('BodyFormatterTests', () => {
    let testSubject: BodyFormatter;
    const defaultConfig: IBodyDrawerConfiguration = {
        injectedClassName: 'test-injected-className',
    };

    beforeEach(() => {
        testSubject = new BodyFormatter('test-injected-className');
    });

    test('Verify the configuration is correct', () => {
        const config = testSubject.getDrawerConfiguration();
        expect(config).toEqual(defaultConfig);
    });
});
