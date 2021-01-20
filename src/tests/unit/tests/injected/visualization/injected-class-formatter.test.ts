// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectedClassDrawerConfiguration } from '../../../../../injected/visualization/formatter';
import { InjectedClassFormatter } from '../../../../../injected/visualization/injected-class-formatter';
import { TargetType } from '../../../../../common/types/target-type';

describe('InjectedClassFormatterTests', () => {
    let testSubject: InjectedClassFormatter;
    const defaultConfig: InjectedClassDrawerConfiguration = {
        injectedClassName: 'test-injected-className',
        targetType: TargetType.Single,
    };

    beforeEach(() => {
        testSubject = new InjectedClassFormatter('test-injected-className');
    });

    test('Verify the configuration is correct', () => {
        const config = testSubject.getDrawerConfiguration();
        expect(config).toEqual(defaultConfig);
    });
});
