// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SingleTargetDrawerConfiguration } from '../../../../../injected/visualization/formatter';
import { SingleTargetFormatter } from '../../../../../injected/visualization/single-target-formatter';

describe('SingleFormatterTests', () => {
    let testSubject: SingleTargetFormatter;
    const defaultConfig: SingleTargetDrawerConfiguration = {
        injectedClassName: 'test-injected-className',
    };

    beforeEach(() => {
        testSubject = new SingleTargetFormatter('test-injected-className');
    });

    test('Verify the configuration is correct', () => {
        const config = testSubject.getDrawerConfiguration();
        expect(config).toEqual(defaultConfig);
    });
});
